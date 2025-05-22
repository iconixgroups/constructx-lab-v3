const Task = require('../models/task.model');
const Project = require('../models/project.model');
const User = require('../models/user.model');
const { createError } = require('../utils/error');

// Create a new task
exports.createTask = async (req, res, next) => {
  try {
    const { 
      title, 
      description, 
      projectId, 
      status, 
      priority, 
      assignedTo, 
      dueDate, 
      startDate, 
      estimatedHours, 
      tags, 
      subtasks,
      dependencies
    } = req.body;
    
    // Check if project exists and belongs to user's company
    const project = await Project.findOne({
      _id: projectId,
      company: req.user.company
    });
    
    if (!project) {
      return next(createError(404, 'Project not found'));
    }
    
    // Check if assigned user exists and belongs to the company
    let assignedUser = null;
    if (assignedTo) {
      assignedUser = await User.findOne({
        _id: assignedTo,
        company: req.user.company
      });
      
      if (!assignedUser) {
        return next(createError(404, 'Assigned user not found or not part of your company'));
      }
    }
    
    // Create new task
    const task = new Task({
      title,
      description,
      project: projectId,
      company: req.user.company,
      status: status || 'todo',
      priority: priority || 'medium',
      assignedTo: assignedTo || null,
      createdBy: req.user._id,
      dueDate,
      startDate,
      estimatedHours,
      tags: tags || [],
      subtasks: subtasks || []
    });
    
    // Add dependencies if provided
    if (dependencies && Array.isArray(dependencies)) {
      // Validate each dependency
      for (const dep of dependencies) {
        const dependencyTask = await Task.findOne({
          _id: dep.task,
          project: projectId
        });
        
        if (!dependencyTask) {
          return next(createError(404, `Dependency task ${dep.task} not found`));
        }
        
        task.dependencies.push({
          task: dep.task,
          type: dep.type || 'finish_to_start'
        });
      }
    }
    
    await task.save();
    
    // Populate task with user information
    await task.populate('assignedTo', 'firstName lastName email');
    await task.populate('createdBy', 'firstName lastName email');
    
    res.status(201).json({
      success: true,
      task
    });
  } catch (error) {
    next(createError(500, 'Error creating task: ' + error.message));
  }
};

// Get all tasks for a project
exports.getProjectTasks = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { status, priority, assignedTo, search, sort, limit = 50, page = 1 } = req.query;
    
    // Check if project exists and belongs to user's company
    const project = await Project.findOne({
      _id: projectId,
      company: req.user.company
    });
    
    if (!project) {
      return next(createError(404, 'Project not found'));
    }
    
    // Build query
    const query = { 
      project: projectId,
      company: req.user.company,
      isActive: true
    };
    
    // Filter by status if provided
    if (status) {
      query.status = status;
    }
    
    // Filter by priority if provided
    if (priority) {
      query.priority = priority;
    }
    
    // Filter by assigned user if provided
    if (assignedTo) {
      query.assignedTo = assignedTo;
    }
    
    // Search by title or description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
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
    const tasks = await Task.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('assignedTo', 'firstName lastName email')
      .populate('createdBy', 'firstName lastName email');
    
    // Get total count for pagination
    const totalTasks = await Task.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: tasks.length,
      totalPages: Math.ceil(totalTasks / limit),
      currentPage: parseInt(page),
      tasks
    });
  } catch (error) {
    next(createError(500, 'Error fetching tasks: ' + error.message));
  }
};

// Get task by ID
exports.getTaskById = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    
    const task = await Task.findOne({
      _id: taskId,
      company: req.user.company,
      isActive: true
    })
      .populate('assignedTo', 'firstName lastName email')
      .populate('createdBy', 'firstName lastName email')
      .populate('dependencies.task', 'title status');
    
    if (!task) {
      return next(createError(404, 'Task not found'));
    }
    
    res.status(200).json({
      success: true,
      task
    });
  } catch (error) {
    next(createError(500, 'Error fetching task: ' + error.message));
  }
};

// Update task
exports.updateTask = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const { 
      title, 
      description, 
      status, 
      priority, 
      assignedTo, 
      dueDate, 
      startDate, 
      estimatedHours, 
      actualHours,
      tags, 
      subtasks,
      dependencies
    } = req.body;
    
    // Find task
    const task = await Task.findOne({
      _id: taskId,
      company: req.user.company,
      isActive: true
    });
    
    if (!task) {
      return next(createError(404, 'Task not found'));
    }
    
    // Check if assigned user exists and belongs to the company
    if (assignedTo) {
      const assignedUser = await User.findOne({
        _id: assignedTo,
        company: req.user.company
      });
      
      if (!assignedUser) {
        return next(createError(404, 'Assigned user not found or not part of your company'));
      }
    }
    
    // Update task fields
    if (title) task.title = title;
    if (description !== undefined) task.description = description;
    
    // If status is changing to completed, set completedDate
    if (status && status === 'completed' && task.status !== 'completed') {
      task.completedDate = new Date();
    }
    
    if (status) task.status = status;
    if (priority) task.priority = priority;
    if (assignedTo !== undefined) task.assignedTo = assignedTo;
    if (dueDate) task.dueDate = dueDate;
    if (startDate) task.startDate = startDate;
    if (estimatedHours) task.estimatedHours = estimatedHours;
    if (actualHours) task.actualHours = actualHours;
    if (tags) task.tags = tags;
    
    // Update subtasks if provided
    if (subtasks && Array.isArray(subtasks)) {
      // Keep existing subtasks that aren't in the new list
      const existingSubtaskIds = task.subtasks
        .filter(st => st._id)
        .map(st => st._id.toString());
      
      const newSubtasks = subtasks.filter(st => !st._id);
      const updatedSubtasks = subtasks.filter(st => st._id);
      
      // Update existing subtasks
      for (const updatedSubtask of updatedSubtasks) {
        const subtaskIndex = task.subtasks.findIndex(
          st => st._id.toString() === updatedSubtask._id
        );
        
        if (subtaskIndex !== -1) {
          task.subtasks[subtaskIndex].title = updatedSubtask.title || task.subtasks[subtaskIndex].title;
          task.subtasks[subtaskIndex].isCompleted = updatedSubtask.isCompleted !== undefined ? 
            updatedSubtask.isCompleted : task.subtasks[subtaskIndex].isCompleted;
          task.subtasks[subtaskIndex].assignedTo = updatedSubtask.assignedTo || task.subtasks[subtaskIndex].assignedTo;
          
          // Set completedAt date if newly completed
          if (updatedSubtask.isCompleted && !task.subtasks[subtaskIndex].completedAt) {
            task.subtasks[subtaskIndex].completedAt = new Date();
          }
        }
      }
      
      // Add new subtasks
      task.subtasks.push(...newSubtasks);
    }
    
    // Update dependencies if provided
    if (dependencies && Array.isArray(dependencies)) {
      // Clear existing dependencies
      task.dependencies = [];
      
      // Add new dependencies
      for (const dep of dependencies) {
        const dependencyTask = await Task.findOne({
          _id: dep.task,
          project: task.project
        });
        
        if (!dependencyTask) {
          return next(createError(404, `Dependency task ${dep.task} not found`));
        }
        
        // Check for circular dependencies
        if (dep.task.toString() === taskId) {
          return next(createError(400, 'Task cannot depend on itself'));
        }
        
        // Check if the dependency task depends on this task (would create a circular dependency)
        const circularCheck = await Task.findOne({
          _id: dep.task,
          'dependencies.task': taskId
        });
        
        if (circularCheck) {
          return next(createError(400, 'Circular dependency detected'));
        }
        
        task.dependencies.push({
          task: dep.task,
          type: dep.type || 'finish_to_start'
        });
      }
    }
    
    await task.save();
    
    // Populate task with user information
    await task.populate('assignedTo', 'firstName lastName email');
    await task.populate('createdBy', 'firstName lastName email');
    await task.populate('dependencies.task', 'title status');
    
    res.status(200).json({
      success: true,
      task
    });
  } catch (error) {
    next(createError(500, 'Error updating task: ' + error.message));
  }
};

// Delete task
exports.deleteTask = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    
    // Find task
    const task = await Task.findOne({
      _id: taskId,
      company: req.user.company
    });
    
    if (!task) {
      return next(createError(404, 'Task not found'));
    }
    
    // Check if user is authorized to delete task
    const isProjectManager = await Project.findOne({
      _id: task.project,
      'team.user': req.user._id,
      'team.role': 'project_manager'
    });
    
    if (task.createdBy.toString() !== req.user._id.toString() && 
        !isProjectManager && 
        req.user.role !== 'owner' && 
        req.user.role !== 'admin') {
      return next(createError(403, 'Not authorized to delete this task'));
    }
    
    // Check if any other tasks depend on this one
    const dependentTasks = await Task.find({
      'dependencies.task': taskId,
      isActive: true
    });
    
    if (dependentTasks.length > 0) {
      return next(createError(400, 'Cannot delete task because other tasks depend on it. Remove dependencies first.'));
    }
    
    // Soft delete task
    task.isActive = false;
    await task.save();
    
    res.status(200).json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    next(createError(500, 'Error deleting task: ' + error.message));
  }
};

// Add comment to task
exports.addTaskComment = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const { text, attachments } = req.body;
    
    if (!text) {
      return next(createError(400, 'Comment text is required'));
    }
    
    // Find task
    const task = await Task.findOne({
      _id: taskId,
      company: req.user.company,
      isActive: true
    });
    
    if (!task) {
      return next(createError(404, 'Task not found'));
    }
    
    // Add comment
    task.comments.push({
      text,
      author: req.user._id,
      attachments: attachments || []
    });
    
    await task.save();
    
    // Get the newly added comment
    const newComment = task.comments[task.comments.length - 1];
    
    // Populate author information
    await task.populate('comments.author', 'firstName lastName email');
    
    res.status(201).json({
      success: true,
      comment: task.comments.id(newComment._id)
    });
  } catch (error) {
    next(createError(500, 'Error adding comment: ' + error.message));
  }
};

// Start time tracking
exports.startTimeTracking = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const { notes } = req.body;
    
    // Find task
    const task = await Task.findOne({
      _id: taskId,
      company: req.user.company,
      isActive: true
    });
    
    if (!task) {
      return next(createError(404, 'Task not found'));
    }
    
    // Check if user already has an active time tracking session for this task
    const activeSession = task.timeTracking.find(
      session => session.user.toString() === req.user._id.toString() && !session.endTime
    );
    
    if (activeSession) {
      return next(createError(400, 'You already have an active time tracking session for this task'));
    }
    
    // Add new time tracking session
    task.timeTracking.push({
      user: req.user._id,
      startTime: new Date(),
      notes: notes || ''
    });
    
    await task.save();
    
    // Get the newly added session
    const newSession = task.timeTracking[task.timeTracking.length - 1];
    
    res.status(201).json({
      success: true,
      timeTracking: newSession
    });
  } catch (error) {
    next(createError(500, 'Error starting time tracking: ' + error.message));
  }
};

// Stop time tracking
exports.stopTimeTracking = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const { notes } = req.body;
    
    // Find task
    const task = await Task.findOne({
      _id: taskId,
      company: req.user.company,
      isActive: true
    });
    
    if (!task) {
      return next(createError(404, 'Task not found'));
    }
    
    // Find active time tracking session
    const sessionIndex = task.timeTracking.findIndex(
      session => session.user.toString() === req.user._id.toString() && !session.endTime
    );
    
    if (sessionIndex === -1) {
      return next(createError(404, 'No active time tracking session found'));
    }
    
    // Update session
    const endTime = new Date();
    const startTime = task.timeTracking[sessionIndex].startTime;
    const durationMinutes = Math.round((endTime - startTime) / (1000 * 60));
    
    task.timeTracking[sessionIndex].endTime = endTime;
    task.timeTracking[sessionIndex].duration = durationMinutes;
    
    if (notes) {
      task.timeTracking[sessionIndex].notes = notes;
    }
    
    // Update task actual hours
    const totalMinutes = task.timeTracking.reduce((total, session) => {
      return total + (session.duration || 0);
    }, 0);
    
    task.actualHours = Math.round(totalMinutes / 60 * 100) / 100; // Round to 2 decimal places
    
    await task.save();
    
    res.status(200).json({
      success: true,
      timeTracking: task.timeTracking[sessionIndex],
      actualHours: task.actualHours
    });
  } catch (error) {
    next(createError(500, 'Error stopping time tracking: ' + error.message));
  }
};

// Get task time tracking
exports.getTaskTimeTracking = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    
    // Find task
    const task = await Task.findOne({
      _id: taskId,
      company: req.user.company,
      isActive: true
    }).populate('timeTracking.user', 'firstName lastName email');
    
    if (!task) {
      return next(createError(404, 'Task not found'));
    }
    
    // Calculate summary statistics
    const totalMinutes = task.timeTracking.reduce((total, session) => {
      return total + (session.duration || 0);
    }, 0);
    
    const userSummary = {};
    task.timeTracking.forEach(session => {
      if (session.duration) {
        const userId = session.user._id.toString();
        if (!userSummary[userId]) {
          userSummary[userId] = {
            user: {
              _id: session.user._id,
              firstName: session.user.firstName,
              lastName: session.user.lastName,
              email: session.user.email
            },
            totalMinutes: 0,
            sessionCount: 0
          };
        }
        userSummary[userId].totalMinutes += session.duration;
        userSummary[userId].sessionCount += 1;
      }
    });
    
    res.status(200).json({
      success: true,
      timeTracking: task.timeTracking,
      summary: {
        totalMinutes,
        totalHours: Math.round(totalMinutes / 60 * 100) / 100,
        userSummary: Object.values(userSummary)
      }
    });
  } catch (error) {
    next(createError(500, 'Error fetching time tracking: ' + error.message));
  }
};

// Add task attachment
exports.addTaskAttachment = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const { name, fileUrl, fileType } = req.body;
    
    if (!name || !fileUrl || !fileType) {
      return next(createError(400, 'Name, fileUrl, and fileType are required'));
    }
    
    // Find task
    const task = await Task.findOne({
      _id: taskId,
      company: req.user.company,
      isActive: true
    });
    
    if (!task) {
      return next(createError(404, 'Task not found'));
    }
    
    // Add attachment
    task.attachments.push({
      name,
      fileUrl,
      fileType,
      uploadedBy: req.user._id,
      uploadedAt: new Date()
    });
    
    await task.save();
    
    // Get the newly added attachment
    const newAttachment = task.attachments[task.attachments.length - 1];
    
    // Populate user information
    await task.populate('attachments.uploadedBy', 'firstName lastName email');
    
    res.status(201).json({
      success: true,
      attachment: task.attachments.id(newAttachment._id)
    });
  } catch (error) {
    next(createError(500, 'Error adding attachment: ' + error.message));
  }
};

// Get tasks assigned to current user
exports.getMyTasks = async (req, res, next) => {
  try {
    const { status, priority, projectId, search, sort, limit = 50, page = 1 } = req.query;
    
    // Build query
    const query = { 
      assignedTo: req.user._id,
      company: req.user.company,
      isActive: true
    };
    
    // Filter by status if provided
    if (status) {
      query.status = status;
    }
    
    // Filter by priority if provided
    if (priority) {
      query.priority = priority;
    }
    
    // Filter by project if provided
    if (projectId) {
      query.project = projectId;
    }
    
    // Search by title or description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Build sort options
    let sortOptions = { dueDate: 1 }; // Default sort by due date (ascending)
    if (sort) {
      const [field, order] = sort.split(':');
      sortOptions = { [field]: order === 'desc' ? -1 : 1 };
    }
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Execute query with pagination
    const tasks = await Task.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('project', 'name')
      .populate('createdBy', 'firstName lastName email');
    
    // Get total count for pagination
    const totalTasks = await Task.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: tasks.length,
      totalPages: Math.ceil(totalTasks / limit),
      currentPage: parseInt(page),
      tasks
    });
  } catch (error) {
    next(createError(500, 'Error fetching tasks: ' + error.message));
  }
};

// Get task analytics
exports.getTaskAnalytics = async (req, res, next) => {
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
    
    // Get task status counts
    const statusCounts = await Task.aggregate([
      { 
        $match: { 
          project: mongoose.Types.ObjectId(projectId),
          isActive: true
        } 
      },
      { 
        $group: { 
          _id: '$status', 
          count: { $sum: 1 } 
        } 
      }
    ]);
    
    // Get task priority counts
    const priorityCounts = await Task.aggregate([
      { 
        $match: { 
          project: mongoose.Types.ObjectId(projectId),
          isActive: true
        } 
      },
      { 
        $group: { 
          _id: '$priority', 
          count: { $sum: 1 } 
        } 
      }
    ]);
    
    // Get task completion trend (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const completionTrend = await Task.aggregate([
      { 
        $match: { 
          project: mongoose.Types.ObjectId(projectId),
          isActive: true,
          completedDate: { $gte: thirtyDaysAgo }
        } 
      },
      {
        $group: {
          _id: { 
            $dateToString: { 
              format: '%Y-%m-%d', 
              date: '$completedDate' 
            } 
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    // Get user performance
    const userPerformance = await Task.aggregate([
      { 
        $match: { 
          project: mongoose.Types.ObjectId(projectId),
          isActive: true,
          assignedTo: { $ne: null }
        } 
      },
      {
        $group: {
          _id: '$assignedTo',
          totalTasks: { $sum: 1 },
          completedTasks: { 
            $sum: { 
              $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] 
            } 
          },
          totalTime: { 
            $sum: { 
              $reduce: { 
                input: '$timeTracking',
                initialValue: 0,
                in: { $add: ['$$value', '$$this.duration'] }
              } 
            } 
          }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $project: {
          _id: 1,
          user: {
            _id: '$user._id',
            firstName: '$user.firstName',
            lastName: '$user.lastName',
            email: '$user.email'
          },
          totalTasks: 1,
          completedTasks: 1,
          completionRate: { 
            $multiply: [
              { $divide: ['$completedTasks', '$totalTasks'] },
              100
            ]
          },
          totalTimeMinutes: '$totalTime',
          totalTimeHours: { $divide: ['$totalTime', 60] }
        }
      }
    ]);
    
    res.status(200).json({
      success: true,
      analytics: {
        statusCounts: statusCounts.reduce((obj, item) => {
          obj[item._id] = item.count;
          return obj;
        }, {}),
        priorityCounts: priorityCounts.reduce((obj, item) => {
          obj[item._id] = item.count;
          return obj;
        }, {}),
        completionTrend,
        userPerformance
      }
    });
  } catch (error) {
    next(createError(500, 'Error fetching task analytics: ' + error.message));
  }
};
