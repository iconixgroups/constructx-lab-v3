const Dashboard = require('../models/dashboard.model');
const Project = require('../models/project.model');
const { createError } = require('../utils/error');

// Create a new dashboard
exports.createDashboard = async (req, res, next) => {
  try {
    const { name, description, projectId, layout, isDefault } = req.body;
    
    // Check if project exists and belongs to user's company
    const project = await Project.findOne({
      _id: projectId,
      company: req.user.company
    });
    
    if (!project) {
      return next(createError(404, 'Project not found'));
    }
    
    // If setting as default, unset any existing default dashboard
    if (isDefault) {
      await Dashboard.updateMany(
        { project: projectId, isDefault: true },
        { isDefault: false }
      );
    }
    
    // Create new dashboard
    const dashboard = new Dashboard({
      name,
      description,
      project: projectId,
      company: req.user.company,
      createdBy: req.user._id,
      isDefault,
      layout: layout || {
        columns: 3,
        widgets: [
          {
            type: 'project_summary',
            title: 'Project Summary',
            size: { width: 2, height: 1 },
            position: { x: 0, y: 0 },
            config: {}
          },
          {
            type: 'task_status',
            title: 'Task Status',
            size: { width: 1, height: 1 },
            position: { x: 2, y: 0 },
            config: {}
          },
          {
            type: 'upcoming_milestones',
            title: 'Upcoming Milestones',
            size: { width: 1, height: 1 },
            position: { x: 0, y: 1 },
            config: {}
          },
          {
            type: 'recent_activity',
            title: 'Recent Activity',
            size: { width: 2, height: 1 },
            position: { x: 1, y: 1 },
            config: {}
          }
        ]
      }
    });
    
    await dashboard.save();
    
    res.status(201).json({
      success: true,
      dashboard
    });
  } catch (error) {
    next(createError(500, 'Error creating dashboard: ' + error.message));
  }
};

// Get all dashboards for a project
exports.getProjectDashboards = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    
    // Check if project exists and belongs to user's company
    const project = await Project.findOne({
      _id: projectId,
      company: req.user.company
    });
    
    if (!project) {
      return next(createError(404, 'Project not found'));
    }
    
    // Get dashboards
    const dashboards = await Dashboard.find({
      project: projectId,
      isActive: true,
      $or: [
        { createdBy: req.user._id },
        { 'sharedWith.user': req.user._id },
        { isDefault: true }
      ]
    }).sort({ isDefault: -1, createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: dashboards.length,
      dashboards
    });
  } catch (error) {
    next(createError(500, 'Error fetching dashboards: ' + error.message));
  }
};

// Get dashboard by ID
exports.getDashboardById = async (req, res, next) => {
  try {
    const { dashboardId } = req.params;
    
    const dashboard = await Dashboard.findOne({
      _id: dashboardId,
      company: req.user.company,
      isActive: true,
      $or: [
        { createdBy: req.user._id },
        { 'sharedWith.user': req.user._id },
        { isDefault: true }
      ]
    });
    
    if (!dashboard) {
      return next(createError(404, 'Dashboard not found'));
    }
    
    res.status(200).json({
      success: true,
      dashboard
    });
  } catch (error) {
    next(createError(500, 'Error fetching dashboard: ' + error.message));
  }
};

// Update dashboard
exports.updateDashboard = async (req, res, next) => {
  try {
    const { dashboardId } = req.params;
    const { name, description, layout, isDefault } = req.body;
    
    // Find dashboard
    const dashboard = await Dashboard.findOne({
      _id: dashboardId,
      company: req.user.company,
      isActive: true
    });
    
    if (!dashboard) {
      return next(createError(404, 'Dashboard not found'));
    }
    
    // Check if user is authorized to update dashboard
    const canEdit = dashboard.createdBy.toString() === req.user._id.toString() ||
                   dashboard.sharedWith.some(share => 
                     share.user.toString() === req.user._id.toString() && 
                     share.permission === 'edit'
                   );
    
    if (!canEdit) {
      return next(createError(403, 'Not authorized to update this dashboard'));
    }
    
    // If setting as default, unset any existing default dashboard
    if (isDefault && !dashboard.isDefault) {
      await Dashboard.updateMany(
        { project: dashboard.project, isDefault: true },
        { isDefault: false }
      );
    }
    
    // Update dashboard
    dashboard.name = name || dashboard.name;
    dashboard.description = description !== undefined ? description : dashboard.description;
    dashboard.layout = layout || dashboard.layout;
    dashboard.isDefault = isDefault !== undefined ? isDefault : dashboard.isDefault;
    
    await dashboard.save();
    
    res.status(200).json({
      success: true,
      dashboard
    });
  } catch (error) {
    next(createError(500, 'Error updating dashboard: ' + error.message));
  }
};

// Delete dashboard
exports.deleteDashboard = async (req, res, next) => {
  try {
    const { dashboardId } = req.params;
    
    // Find dashboard
    const dashboard = await Dashboard.findOne({
      _id: dashboardId,
      company: req.user.company
    });
    
    if (!dashboard) {
      return next(createError(404, 'Dashboard not found'));
    }
    
    // Check if user is authorized to delete dashboard
    if (dashboard.createdBy.toString() !== req.user._id.toString() && 
        req.user.role !== 'owner' && 
        req.user.role !== 'admin') {
      return next(createError(403, 'Not authorized to delete this dashboard'));
    }
    
    // Don't allow deleting the only default dashboard
    if (dashboard.isDefault) {
      const defaultDashboardCount = await Dashboard.countDocuments({
        project: dashboard.project,
        isDefault: true,
        isActive: true
      });
      
      if (defaultDashboardCount <= 1) {
        return next(createError(400, 'Cannot delete the only default dashboard. Create another default dashboard first.'));
      }
    }
    
    // Soft delete dashboard
    dashboard.isActive = false;
    await dashboard.save();
    
    res.status(200).json({
      success: true,
      message: 'Dashboard deleted successfully'
    });
  } catch (error) {
    next(createError(500, 'Error deleting dashboard: ' + error.message));
  }
};

// Share dashboard with users
exports.shareDashboard = async (req, res, next) => {
  try {
    const { dashboardId } = req.params;
    const { users } = req.body;
    
    if (!users || !Array.isArray(users)) {
      return next(createError(400, 'Users array is required'));
    }
    
    // Find dashboard
    const dashboard = await Dashboard.findOne({
      _id: dashboardId,
      company: req.user.company,
      isActive: true
    });
    
    if (!dashboard) {
      return next(createError(404, 'Dashboard not found'));
    }
    
    // Check if user is authorized to share dashboard
    if (dashboard.createdBy.toString() !== req.user._id.toString() && 
        req.user.role !== 'owner' && 
        req.user.role !== 'admin') {
      return next(createError(403, 'Not authorized to share this dashboard'));
    }
    
    // Update shared users
    for (const userShare of users) {
      const existingShareIndex = dashboard.sharedWith.findIndex(
        share => share.user.toString() === userShare.userId
      );
      
      if (existingShareIndex >= 0) {
        // Update existing share
        dashboard.sharedWith[existingShareIndex].permission = userShare.permission || 'view';
      } else {
        // Add new share
        dashboard.sharedWith.push({
          user: userShare.userId,
          permission: userShare.permission || 'view'
        });
      }
    }
    
    await dashboard.save();
    
    res.status(200).json({
      success: true,
      message: 'Dashboard shared successfully',
      sharedWith: dashboard.sharedWith
    });
  } catch (error) {
    next(createError(500, 'Error sharing dashboard: ' + error.message));
  }
};

// Remove dashboard share
exports.removeDashboardShare = async (req, res, next) => {
  try {
    const { dashboardId, userId } = req.params;
    
    // Find dashboard
    const dashboard = await Dashboard.findOne({
      _id: dashboardId,
      company: req.user.company,
      isActive: true
    });
    
    if (!dashboard) {
      return next(createError(404, 'Dashboard not found'));
    }
    
    // Check if user is authorized to modify shares
    if (dashboard.createdBy.toString() !== req.user._id.toString() && 
        req.user.role !== 'owner' && 
        req.user.role !== 'admin') {
      return next(createError(403, 'Not authorized to modify dashboard shares'));
    }
    
    // Remove share
    dashboard.sharedWith = dashboard.sharedWith.filter(
      share => share.user.toString() !== userId
    );
    
    await dashboard.save();
    
    res.status(200).json({
      success: true,
      message: 'Dashboard share removed successfully',
      sharedWith: dashboard.sharedWith
    });
  } catch (error) {
    next(createError(500, 'Error removing dashboard share: ' + error.message));
  }
};

// Get dashboard widget data
exports.getDashboardWidgetData = async (req, res, next) => {
  try {
    const { dashboardId, widgetId } = req.params;
    
    // Find dashboard
    const dashboard = await Dashboard.findOne({
      _id: dashboardId,
      company: req.user.company,
      isActive: true,
      $or: [
        { createdBy: req.user._id },
        { 'sharedWith.user': req.user._id },
        { isDefault: true }
      ]
    });
    
    if (!dashboard) {
      return next(createError(404, 'Dashboard not found'));
    }
    
    // Find widget
    const widget = dashboard.layout.widgets.id(widgetId);
    
    if (!widget) {
      return next(createError(404, 'Widget not found'));
    }
    
    // Get widget data based on type
    let data;
    
    switch (widget.type) {
      case 'project_summary':
        // Get project summary data
        const project = await Project.findById(dashboard.project);
        data = {
          name: project.name,
          status: project.status,
          startDate: project.startDate,
          endDate: project.endDate,
          budget: project.budget,
          client: project.client
        };
        break;
        
      case 'task_status':
        // Get task status data
        const Task = require('../models/task.model');
        const taskCounts = await Task.aggregate([
          { $match: { project: dashboard.project, isActive: true } },
          { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);
        
        data = {
          statusCounts: {
            backlog: 0,
            todo: 0,
            in_progress: 0,
            review: 0,
            completed: 0,
            blocked: 0
          }
        };
        
        taskCounts.forEach(item => {
          data.statusCounts[item._id] = item.count;
        });
        break;
        
      case 'upcoming_milestones':
        // Get upcoming milestones
        const Milestone = require('../models/milestone.model');
        const milestones = await Milestone.find({
          project: dashboard.project,
          isActive: true,
          date: { $gte: new Date() }
        })
        .sort({ date: 1 })
        .limit(5);
        
        data = { milestones };
        break;
        
      case 'recent_activity':
        // Get recent activity
        const Activity = require('../models/activity.model');
        const activities = await Activity.find({
          project: dashboard.project
        })
        .sort({ createdAt: -1 })
        .limit(10)
        .populate('user', 'firstName lastName');
        
        data = { activities };
        break;
        
      default:
        data = { message: 'Widget type not supported' };
    }
    
    res.status(200).json({
      success: true,
      widget,
      data
    });
  } catch (error) {
    next(createError(500, 'Error fetching widget data: ' + error.message));
  }
};

// Add widget to dashboard
exports.addDashboardWidget = async (req, res, next) => {
  try {
    const { dashboardId } = req.params;
    const { type, title, size, position, config, dataSource, refreshInterval } = req.body;
    
    // Validate widget type
    const validTypes = [
      'project_summary',
      'task_status',
      'schedule_timeline',
      'budget_overview',
      'team_performance',
      'recent_activity',
      'upcoming_milestones',
      'risk_assessment',
      'weather_forecast',
      'document_activity',
      'quality_metrics',
      'safety_incidents',
      'custom_chart'
    ];
    
    if (!validTypes.includes(type)) {
      return next(createError(400, 'Invalid widget type'));
    }
    
    // Find dashboard
    const dashboard = await Dashboard.findOne({
      _id: dashboardId,
      company: req.user.company,
      isActive: true
    });
    
    if (!dashboard) {
      return next(createError(404, 'Dashboard not found'));
    }
    
    // Check if user is authorized to update dashboard
    const canEdit = dashboard.createdBy.toString() === req.user._id.toString() ||
                   dashboard.sharedWith.some(share => 
                     share.user.toString() === req.user._id.toString() && 
                     share.permission === 'edit'
                   );
    
    if (!canEdit) {
      return next(createError(403, 'Not authorized to update this dashboard'));
    }
    
    // Add widget
    dashboard.layout.widgets.push({
      type,
      title: title || type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      size: size || { width: 1, height: 1 },
      position: position || { x: 0, y: 0 },
      config: config || {},
      dataSource,
      refreshInterval: refreshInterval || 300
    });
    
    await dashboard.save();
    
    res.status(200).json({
      success: true,
      message: 'Widget added successfully',
      dashboard
    });
  } catch (error) {
    next(createError(500, 'Error adding widget: ' + error.message));
  }
};

// Update dashboard widget
exports.updateDashboardWidget = async (req, res, next) => {
  try {
    const { dashboardId, widgetId } = req.params;
    const { title, size, position, config, dataSource, refreshInterval } = req.body;
    
    // Find dashboard
    const dashboard = await Dashboard.findOne({
      _id: dashboardId,
      company: req.user.company,
      isActive: true
    });
    
    if (!dashboard) {
      return next(createError(404, 'Dashboard not found'));
    }
    
    // Check if user is authorized to update dashboard
    const canEdit = dashboard.createdBy.toString() === req.user._id.toString() ||
                   dashboard.sharedWith.some(share => 
                     share.user.toString() === req.user._id.toString() && 
                     share.permission === 'edit'
                   );
    
    if (!canEdit) {
      return next(createError(403, 'Not authorized to update this dashboard'));
    }
    
    // Find widget
    const widget = dashboard.layout.widgets.id(widgetId);
    
    if (!widget) {
      return next(createError(404, 'Widget not found'));
    }
    
    // Update widget
    if (title) widget.title = title;
    if (size) widget.size = size;
    if (position) widget.position = position;
    if (config) widget.config = config;
    if (dataSource) widget.dataSource = dataSource;
    if (refreshInterval) widget.refreshInterval = refreshInterval;
    
    await dashboard.save();
    
    res.status(200).json({
      success: true,
      message: 'Widget updated successfully',
      widget
    });
  } catch (error) {
    next(createError(500, 'Error updating widget: ' + error.message));
  }
};

// Remove dashboard widget
exports.removeDashboardWidget = async (req, res, next) => {
  try {
    const { dashboardId, widgetId } = req.params;
    
    // Find dashboard
    const dashboard = await Dashboard.findOne({
      _id: dashboardId,
      company: req.user.company,
      isActive: true
    });
    
    if (!dashboard) {
      return next(createError(404, 'Dashboard not found'));
    }
    
    // Check if user is authorized to update dashboard
    const canEdit = dashboard.createdBy.toString() === req.user._id.toString() ||
                   dashboard.sharedWith.some(share => 
                     share.user.toString() === req.user._id.toString() && 
                     share.permission === 'edit'
                   );
    
    if (!canEdit) {
      return next(createError(403, 'Not authorized to update this dashboard'));
    }
    
    // Find widget
    const widgetIndex = dashboard.layout.widgets.findIndex(
      widget => widget._id.toString() === widgetId
    );
    
    if (widgetIndex === -1) {
      return next(createError(404, 'Widget not found'));
    }
    
    // Remove widget
    dashboard.layout.widgets.splice(widgetIndex, 1);
    await dashboard.save();
    
    res.status(200).json({
      success: true,
      message: 'Widget removed successfully'
    });
  } catch (error) {
    next(createError(500, 'Error removing widget: ' + error.message));
  }
};
