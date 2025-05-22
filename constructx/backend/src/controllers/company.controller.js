const Company = require('../models/company.model');
const User = require('../models/user.model');
const Subscription = require('../models/subscription.model');
const { createError } = require('../utils/error');

// Create a new company
exports.createCompany = async (req, res, next) => {
  try {
    const { name, industry, size, website, address } = req.body;
    
    // Create company
    const company = new Company({
      name,
      industry,
      size,
      website,
      address,
      owner: req.user.id
    });
    
    // Save company
    await company.save();
    
    // Update user with company
    await User.findByIdAndUpdate(req.user.id, { company: company._id, role: 'owner' });
    
    res.status(201).json({
      success: true,
      company
    });
  } catch (error) {
    next(createError(500, 'Error creating company: ' + error.message));
  }
};

// Get company details
exports.getCompany = async (req, res, next) => {
  try {
    const company = await Company.findById(req.user.company)
      .populate('subscription')
      .populate('owner', 'firstName lastName email');
    
    if (!company) {
      return next(createError(404, 'Company not found'));
    }
    
    res.status(200).json({
      success: true,
      company
    });
  } catch (error) {
    next(createError(500, 'Error fetching company: ' + error.message));
  }
};

// Update company details
exports.updateCompany = async (req, res, next) => {
  try {
    const { name, industry, size, website, address, settings } = req.body;
    
    // Check if user is owner or admin
    if (req.user.role !== 'owner' && req.user.role !== 'admin') {
      return next(createError(403, 'Not authorized to update company details'));
    }
    
    // Update company
    const company = await Company.findByIdAndUpdate(
      req.user.company,
      { name, industry, size, website, address, settings },
      { new: true, runValidators: true }
    );
    
    if (!company) {
      return next(createError(404, 'Company not found'));
    }
    
    res.status(200).json({
      success: true,
      company
    });
  } catch (error) {
    next(createError(500, 'Error updating company: ' + error.message));
  }
};

// Upload company logo
exports.uploadLogo = async (req, res, next) => {
  try {
    // Logo upload would be handled by a file upload middleware
    // This is a placeholder for the actual implementation
    const logoUrl = req.file ? req.file.path : null;
    
    if (!logoUrl) {
      return next(createError(400, 'No logo file provided'));
    }
    
    // Update company with logo URL
    const company = await Company.findByIdAndUpdate(
      req.user.company,
      { logo: logoUrl },
      { new: true }
    );
    
    if (!company) {
      return next(createError(404, 'Company not found'));
    }
    
    res.status(200).json({
      success: true,
      logo: logoUrl
    });
  } catch (error) {
    next(createError(500, 'Error uploading logo: ' + error.message));
  }
};

// Get company users
exports.getCompanyUsers = async (req, res, next) => {
  try {
    const users = await User.find({ company: req.user.company })
      .select('firstName lastName email role isActive lastLogin');
    
    res.status(200).json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    next(createError(500, 'Error fetching company users: ' + error.message));
  }
};

// Invite user to company
exports.inviteUser = async (req, res, next) => {
  try {
    const { email, role } = req.body;
    
    // Check if user is owner or admin
    if (req.user.role !== 'owner' && req.user.role !== 'admin') {
      return next(createError(403, 'Not authorized to invite users'));
    }
    
    // Check subscription user limit
    const company = await Company.findById(req.user.company).populate('subscription');
    const currentUserCount = await User.countDocuments({ company: req.user.company });
    
    if (company.subscription && company.subscription.hasReachedUserLimit(currentUserCount)) {
      return next(createError(403, 'User limit reached for current subscription plan'));
    }
    
    // Check if user already exists
    let user = await User.findOne({ email });
    
    if (user) {
      // If user exists but not in this company
      if (user.company) {
        return next(createError(400, 'User already belongs to another company'));
      }
      
      // Update existing user with company and role
      user.company = req.user.company;
      user.role = role;
      await user.save();
      
      // Send invitation email (would be implemented in email service)
      // await sendCompanyInvitationEmail(user.email, company.name);
      
      return res.status(200).json({
        success: true,
        message: 'Invitation sent to existing user',
        user: {
          id: user._id,
          email: user.email,
          role: user.role
        }
      });
    }
    
    // Create new user with temporary password
    const tempPassword = Math.random().toString(36).substring(2, 10);
    
    user = new User({
      email,
      firstName: 'Invited',
      lastName: 'User',
      password: tempPassword,
      role,
      company: req.user.company,
      isEmailVerified: false
    });
    
    // Generate verification token
    const verificationToken = user.generateVerificationToken();
    await user.save();
    
    // Send invitation email with verification token
    // await sendCompanyInvitationEmail(user.email, company.name, verificationToken, tempPassword);
    
    res.status(201).json({
      success: true,
      message: 'Invitation sent to new user',
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    next(createError(500, 'Error inviting user: ' + error.message));
  }
};

// Update user role
exports.updateUserRole = async (req, res, next) => {
  try {
    const { userId, role } = req.body;
    
    // Check if user is owner or admin
    if (req.user.role !== 'owner' && req.user.role !== 'admin') {
      return next(createError(403, 'Not authorized to update user roles'));
    }
    
    // Find user
    const user = await User.findById(userId);
    
    if (!user) {
      return next(createError(404, 'User not found'));
    }
    
    // Check if user belongs to same company
    if (user.company.toString() !== req.user.company.toString()) {
      return next(createError(403, 'User does not belong to your company'));
    }
    
    // Prevent changing owner's role
    if (user.role === 'owner') {
      return next(createError(403, 'Cannot change company owner\'s role'));
    }
    
    // Update role
    user.role = role;
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'User role updated successfully',
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    next(createError(500, 'Error updating user role: ' + error.message));
  }
};

// Remove user from company
exports.removeUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    
    // Check if user is owner or admin
    if (req.user.role !== 'owner' && req.user.role !== 'admin') {
      return next(createError(403, 'Not authorized to remove users'));
    }
    
    // Find user
    const user = await User.findById(userId);
    
    if (!user) {
      return next(createError(404, 'User not found'));
    }
    
    // Check if user belongs to same company
    if (user.company.toString() !== req.user.company.toString()) {
      return next(createError(403, 'User does not belong to your company'));
    }
    
    // Prevent removing owner
    if (user.role === 'owner') {
      return next(createError(403, 'Cannot remove company owner'));
    }
    
    // Remove company association
    user.company = null;
    user.role = 'member';
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'User removed from company successfully'
    });
  } catch (error) {
    next(createError(500, 'Error removing user: ' + error.message));
  }
};
