const express = require('express');
const router = express.Router();
const { authMiddleware, subscriptionMiddleware } = require('../middleware/auth');
const projectController = require('../controllers/project.controller');

// All routes require authentication
router.use(authMiddleware);

// Create a new project
router.post('/', subscriptionMiddleware, projectController.createProject);

// Get all projects
router.get('/', projectController.getProjects);

// Get project by ID
router.get('/:projectId', projectController.getProjectById);

// Update project
router.put('/:projectId', projectController.updateProject);

// Delete project
router.delete('/:projectId', projectController.deleteProject);

// Project team management
router.get('/:projectId/team', projectController.getProjectTeam);
router.post('/:projectId/team', projectController.addTeamMember);
router.delete('/:projectId/team/:userId', projectController.removeTeamMember);
router.put('/:projectId/team/:userId/role', projectController.updateTeamMemberRole);

module.exports = router;
