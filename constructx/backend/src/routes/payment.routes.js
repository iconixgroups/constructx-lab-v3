const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

// All routes require authentication
router.use(authMiddleware);

// Add payment method (owner or admin only)
router.post('/methods', roleMiddleware(['owner', 'admin']), paymentController.addPaymentMethod);

// Get payment methods
router.get('/methods', paymentController.getPaymentMethods);

// Set default payment method (owner or admin only)
router.put('/methods/:paymentMethodId/default', roleMiddleware(['owner', 'admin']), paymentController.setDefaultPaymentMethod);

// Remove payment method (owner or admin only)
router.delete('/methods/:paymentMethodId', roleMiddleware(['owner', 'admin']), paymentController.removePaymentMethod);

// Process payment (owner or admin only)
router.post('/process', roleMiddleware(['owner', 'admin']), paymentController.processPayment);

// Get payment history
router.get('/history', paymentController.getPaymentHistory);

// Get payment details
router.get('/:paymentId', paymentController.getPaymentDetails);

module.exports = router;
