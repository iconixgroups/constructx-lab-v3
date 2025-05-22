const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task.controller');
const { authMiddleware } = require('../middleware/auth');

// All routes require authentication
router.use(authMiddleware);

// Create a new task
router.post('/', taskController.createTask);

// Get all tasks for a project
router.get('/project/:projectId', taskController.getProjectTasks);

// Get task by ID
router.get('/:taskId', taskController.getTaskById);

// Update task
router.put('/:taskId', taskController.updateTask);

// Delete task
router.delete('/:taskId', taskController.deleteTask);

// Add comment to task
router.post('/:taskId/comments', taskController.addTaskComment);

// Start time tracking
router.post('/:taskId/time-tracking/start', taskController.startTimeTracking);

// Stop time tracking
router.post('/:taskId/time-tracking/stop', taskController.stopTimeTracking);

// Get task time tracking
router.get('/:taskId/time-tracking', taskController.getTaskTimeTracking);

// Add task attachment
router.post('/:taskId/attachments', taskController.addTaskAttachment);

// Get tasks assigned to current user
router.get('/my-tasks', taskController.getMyTasks);

// Get task analytics
router.get('/analytics/project/:projectId', taskController.getTaskAnalytics);

module.exports = router;
