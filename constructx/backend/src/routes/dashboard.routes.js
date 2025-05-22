const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const { authMiddleware } = require('../middleware/auth');

// All routes require authentication
router.use(authMiddleware);

// Create a new dashboard
router.post('/', dashboardController.createDashboard);

// Get all dashboards for a project
router.get('/project/:projectId', dashboardController.getProjectDashboards);

// Get dashboard by ID
router.get('/:dashboardId', dashboardController.getDashboardById);

// Update dashboard
router.put('/:dashboardId', dashboardController.updateDashboard);

// Delete dashboard
router.delete('/:dashboardId', dashboardController.deleteDashboard);

// Share dashboard with users
router.post('/:dashboardId/share', dashboardController.shareDashboard);

// Remove dashboard share
router.delete('/:dashboardId/share/:userId', dashboardController.removeDashboardShare);

// Get dashboard widget data
router.get('/:dashboardId/widgets/:widgetId/data', dashboardController.getDashboardWidgetData);

// Add widget to dashboard
router.post('/:dashboardId/widgets', dashboardController.addDashboardWidget);

// Update dashboard widget
router.put('/:dashboardId/widgets/:widgetId', dashboardController.updateDashboardWidget);

// Remove dashboard widget
router.delete('/:dashboardId/widgets/:widgetId', dashboardController.removeDashboardWidget);

module.exports = router;
