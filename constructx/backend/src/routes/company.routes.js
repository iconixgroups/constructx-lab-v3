const express = require('express');
const router = express.Router();
const companyController = require('../controllers/company.controller');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

// All routes require authentication
router.use(authMiddleware);

// Create company
router.post('/', companyController.createCompany);

// Get company details
router.get('/', companyController.getCompany);

// Update company details (owner or admin only)
router.put('/', roleMiddleware(['owner', 'admin']), companyController.updateCompany);

// Upload company logo (owner or admin only)
router.post('/logo', roleMiddleware(['owner', 'admin']), companyController.uploadLogo);

// Get company users
router.get('/users', companyController.getCompanyUsers);

// Invite user to company (owner or admin only)
router.post('/users/invite', roleMiddleware(['owner', 'admin']), companyController.inviteUser);

// Update user role (owner or admin only)
router.put('/users/role', roleMiddleware(['owner', 'admin']), companyController.updateUserRole);

// Remove user from company (owner or admin only)
router.delete('/users/:userId', roleMiddleware(['owner', 'admin']), companyController.removeUser);

module.exports = router;
