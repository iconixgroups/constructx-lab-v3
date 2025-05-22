const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscription.controller');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

// All routes require authentication
router.use(authMiddleware);

// Get subscription plans (public)
router.get('/plans', subscriptionController.getPlans);

// Create a new subscription (owner or admin only)
router.post('/', roleMiddleware(['owner', 'admin']), subscriptionController.createSubscription);

// Get current subscription
router.get('/current', subscriptionController.getCurrentSubscription);

// Update subscription (change plan) (owner or admin only)
router.put('/', roleMiddleware(['owner', 'admin']), subscriptionController.updateSubscription);

// Cancel subscription (owner or admin only)
router.post('/cancel', roleMiddleware(['owner', 'admin']), subscriptionController.cancelSubscription);

// Convert trial to paid subscription (owner or admin only)
router.post('/convert-trial', roleMiddleware(['owner', 'admin']), subscriptionController.convertTrialToPaid);

module.exports = router;
