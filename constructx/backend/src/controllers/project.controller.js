const Project = require('../models/project.model');
const Company = require('../models/company.model');
const User = require('../models/user.model');
const { createError } = require('../utils/error');

// Create a new project
exports.createProject = async (req, res, next) => {
  try {
    const { name, description, startDate, endDate, budget, location, client, tags } = req.body;
    
    // Check if company has reached project limit
    const company = await Company.findById(req.user.company).populate('subscription');
    if (!company) {
      return next(createError(404, 'Company not found'));
    }
    
    // Verify subscription and project limits
    if (!company.subscription) {
      return next(createError(403, 'Active subscription required to create projects'));
    }
    
    // Count existing active projects
    const projectCount = await Project.countDocuments({ 
      company: company._id,
      isActive: true
    });
    
    // Check if project limit is reached based on subscription plan
    if (company.subscription.limits.projects !== 'Unlimited' && 
        projectCount >= company.subscription.limits.projects) {
      return next(createError(403, `Project limit reached (${projectCount}/${company.subscription.limits.projects}). Please upgrade your subscription plan to create more projects.`));
    }
    
    // Create new project
    const project = new Project({
      name,
      description,
      company: company._id,
      startDate,
      endDate,
      budget,
      location,
      client,
      tags,
      createdBy: req.user._id,
      team: [{ user: req.user._id, role: 'project_manager' }]
    });
    
    // Save project
    await project.save();
    
    res.status(201).json({
      success: true,
      project
    });
  } catch (error) {
    next(createError(500, 'Error creating project: ' + error.message));
  }
};

// Get all projects for company
exports.getProjects = async (req, res, next) => {
  try {
    const { status, search, sort, limit = 10, page = 1 } = req.query;
    
    // Build query
    const query = { company: req.user.company };
    
    // Filter by status if provided
    if (status) {
      query.status = status;
    }
    
    // Search by name or description
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Build sort options
    let sortOptions = { createdAt: -1 }; // Default sort by creation date (newest first)
    if (sort) {
      const [field, order] = sort.split(':');
      sortOptions = { [field]: order === 'desc' ? -1 : 1 };
    }
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Execute query with pagination
    const projects = await Project.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('createdBy', 'firstName lastName email')
      .populate('team.user', 'firstName lastName email');
    
    // Get total count for pagination
    const totalProjects = await Project.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: projects.length,
      totalPages: Math.ceil(totalProjects / limit),
      currentPage: parseInt(page),
      projects
    });
  } catch (error) {
    next(createError(500, 'Error fetching projects: ' + error.message));
  }
};

// Get project by ID
exports.getProjectById = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    
    const project = await Project.findOne({
      _id: projectId,
      company: req.user.company
    })
      .populate('createdBy', 'firstName lastName email')
      .populate('team.user', 'firstName lastName email');
    
    if (!project) {
      return next(createError(404, 'Project not found'));
    }
    
    res.status(200).json({
      success: true,
      project
    });
  } catch (error) {
    next(createError(500, 'Error fetching project: ' + error.message));
  }
};

// Update project
exports.updateProject = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { name, description, status, startDate, endDate, budget, location, client, tags } = req.body;
    
    // Find project
    const project = await Project.findOne({
      _id: projectId,
      company: req.user.company
    });
    
    if (!project) {
      return next(createError(404, 'Project not found'));
    }
    
    // Check if user is authorized to update project
    const isProjectManager = project.team.some(member => 
      member.user.toString() === req.user._id.toString() && 
      member.role === 'project_manager'
    );
    
    if (req.user.role !== 'owner' && req.user.role !== 'admin' && !isProjectManager) {
      return next(createError(403, 'Not authorized to update this project'));
    }
    
    // Update project
    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      {
        name,
        description,
        status,
        startDate,
        endDate,
        budget,
        location,
        client,
        tags
      },
      { new: true, runValidators: true }
    )
      .populate('createdBy', 'firstName lastName email')
      .populate('team.user', 'firstName lastName email');
    
    res.status(200).json({
      success: true,
      project: updatedProject
    });
  } catch (error) {
    next(createError(500, 'Error updating project: ' + error.message));
  }
};

// Delete project
exports.deleteProject = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    
    // Find project
    const project = await Project.findOne({
      _id: projectId,
      company: req.user.company
    });
    
    if (!project) {
      return next(createError(404, 'Project not found'));
    }
    
    // Check if user is authorized to delete project
    if (req.user.role !== 'owner' && req.user.role !== 'admin') {
      return next(createError(403, 'Not authorized to delete this project'));
    }
    
    // Soft delete project
    project.isActive = false;
    await project.save();
    
    res.status(200).json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    next(createError(500, 'Error deleting project: ' + error.message));
  }
};

// Get project team
exports.getProjectTeam = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    
    const project = await Project.findOne({
      _id: projectId,
      company: req.user.company
    }).populate('team.user', 'firstName lastName email role');
    
    if (!project) {
      return next(createError(404, 'Project not found'));
    }
    
    res.status(200).json({
      success: true,
      team: project.team
    });
  } catch (error) {
    next(createError(500, 'Error fetching project team: ' + error.message));
  }
};

// Add team member to project
exports.addTeamMember = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { userId, role } = req.body;
    
    // Find project
    const project = await Project.findOne({
      _id: projectId,
      company: req.user.company
    });
    
    if (!project) {
      return next(createError(404, 'Project not found'));
    }
    
    // Check if user is authorized to add team members
    const isProjectManager = project.team.some(member => 
      member.user.toString() === req.user._id.toString() && 
      member.role === 'project_manager'
    );
    
    if (req.user.role !== 'owner' && req.user.role !== 'admin' && !isProjectManager) {
      return next(createError(403, 'Not authorized to add team members to this project'));
    }
    
    // Check if user exists and belongs to the same company
    const user = await User.findOne({
      _id: userId,
      company: req.user.company
    });
    
    if (!user) {
      return next(createError(404, 'User not found or not part of your company'));
    }
    
    // Check if user is already in the team
    if (project.team.some(member => member.user.toString() === userId)) {
      return next(createError(400, 'User is already a team member'));
    }
    
    // Add user to team
    project.team.push({
      user: userId,
      role: role || 'member'
    });
    
    await project.save();
    
    // Populate team data
    await project.populate('team.user', 'firstName lastName email');
    
    res.status(200).json({
      success: true,
      message: 'Team member added successfully',
      team: project.team
    });
  } catch (error) {
    next(createError(500, 'Error adding team member: ' + error.message));
  }
};

// Remove team member from project
exports.removeTeamMember = async (req, res, next) => {
  try {
    const { projectId, userId } = req.params;
    
    // Find project
    const project = await Project.findOne({
      _id: projectId,
      company: req.user.company
    });
    
    if (!project) {
      return next(createError(404, 'Project not found'));
    }
    
    // Check if user is authorized to remove team members
    const isProjectManager = project.team.some(member => 
      member.user.toString() === req.user._id.toString() && 
      member.role === 'project_manager'
    );
    
    if (req.user.role !== 'owner' && req.user.role !== 'admin' && !isProjectManager) {
      return next(createError(403, 'Not authorized to remove team members from this project'));
    }
    
    // Check if user is in the team
    const memberIndex = project.team.findIndex(member => member.user.toString() === userId);
    
    if (memberIndex === -1) {
      return next(createError(404, 'User is not a team member'));
    }
    
    // Prevent removing the last project manager
    if (project.team[memberIndex].role === 'project_manager') {
      const projectManagerCount = project.team.filter(member => member.role === 'project_manager').length;
      
      if (projectManagerCount === 1) {
        return next(createError(400, 'Cannot remove the only project manager. Assign another project manager first.'));
      }
    }
    
    // Remove user from team
    project.team.splice(memberIndex, 1);
    await project.save();
    
    res.status(200).json({
      success: true,
      message: 'Team member removed successfully',
      team: project.team
    });
  } catch (error) {
    next(createError(500, 'Error removing team member: ' + error.message));
  }
};

// Update team member role
exports.updateTeamMemberRole = async (req, res, next) => {
  try {
    const { projectId, userId } = req.params;
    const { role } = req.body;
    
    if (!['project_manager', 'team_lead', 'member'].includes(role)) {
      return next(createError(400, 'Invalid role'));
    }
    
    // Find project
    const project = await Project.findOne({
      _id: projectId,
      company: req.user.company
    });
    
    if (!project) {
      return next(createError(404, 'Project not found'));
    }
    
    // Check if user is authorized to update team member roles
    const isProjectManager = project.team.some(member => 
      member.user.toString() === req.user._id.toString() && 
      member.role === 'project_manager'
    );
    
    if (req.user.role !== 'owner' && req.user.role !== 'admin' && !isProjectManager) {
      return next(createError(403, 'Not authorized to update team member roles in this project'));
    }
    
    // Check if user is in the team
    const memberIndex = project.team.findIndex(member => member.user.toString() === userId);
    
    if (memberIndex === -1) {
      return next(createError(404, 'User is not a team member'));
    }
    
    // If changing from project manager, ensure there's at least one other project manager
    if (project.team[memberIndex].role === 'project_manager' && role !== 'project_manager') {
      const projectManagerCount = project.team.filter(member => member.role === 'project_manager').length;
      
      if (projectManagerCount === 1) {
        return next(createError(400, 'Cannot remove the only project manager. Assign another project manager first.'));
      }
    }
    
    // Update role
    project.team[memberIndex].role = role;
    await project.save();
    
    // Populate team data
    await project.populate('team.user', 'firstName lastName email');
    
    res.status(200).json({
      success: true,
      message: 'Team member role updated successfully',
      team: project.team
    });
  } catch (error) {
    next(createError(500, 'Error updating team member role: ' + error.message));
  }
};
