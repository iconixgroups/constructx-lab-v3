const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { createError } = require('../utils/error');

exports.authMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return next(createError(401, 'Authentication required'));
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Find user by id
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return next(createError(401, 'User not found'));
    }
    
    if (!user.isActive) {
      return next(createError(401, 'User account is inactive'));
    }
    
    // Add user to request
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return next(createError(401, 'Invalid token'));
    }
    if (error.name === 'TokenExpiredError') {
      return next(createError(401, 'Token expired'));
    }
    next(createError(500, 'Server error during authentication'));
  }
};

exports.roleMiddleware = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(createError(401, 'Authentication required'));
    }
    
    if (!roles.includes(req.user.role)) {
      return next(createError(403, 'Access denied: insufficient permissions'));
    }
    
    next();
  };
};

exports.companyMiddleware = async (req, res, next) => {
  try {
    if (!req.user) {
      return next(createError(401, 'Authentication required'));
    }
    
    if (!req.user.company) {
      return next(createError(403, 'User not associated with any company'));
    }
    
    next();
  } catch (error) {
    next(createError(500, 'Server error during company verification'));
  }
};

exports.subscriptionMiddleware = async (req, res, next) => {
  try {
    if (!req.user || !req.user.company) {
      return next(createError(401, 'Authentication required'));
    }
    
    const Company = require('../models/company.model');
    const Subscription = require('../models/subscription.model');
    
    const company = await Company.findById(req.user.company);
    
    if (!company) {
      return next(createError(404, 'Company not found'));
    }
    
    if (!company.subscription) {
      return next(createError(403, 'No active subscription found'));
    }
    
    const subscription = await Subscription.findById(company.subscription);
    
    if (!subscription || !subscription.isActive()) {
      return next(createError(403, 'Subscription is not active'));
    }
    
    req.subscription = subscription;
    next();
  } catch (error) {
    next(createError(500, 'Server error during subscription verification'));
  }
};
