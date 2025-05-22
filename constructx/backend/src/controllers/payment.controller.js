const PaymentMethod = require('../models/paymentMethod.model');
const Payment = require('../models/payment.model');
const Company = require('../models/company.model');
const { createError } = require('../utils/error');
const { createPaymentMethod, createPaymentIntent, processPayment } = require('../services/payment.service');

// Add payment method
exports.addPaymentMethod = async (req, res, next) => {
  try {
    const { type, cardDetails, bankDetails, paypalDetails } = req.body;
    
    // Validate payment method type
    if (!['credit_card', 'bank_account', 'paypal'].includes(type)) {
      return next(createError(400, 'Invalid payment method type'));
    }
    
    // Validate required details based on type
    if (type === 'credit_card' && (!cardDetails || !cardDetails.cardholderName)) {
      return next(createError(400, 'Card details required for credit card payment method'));
    }
    
    if (type === 'bank_account' && (!bankDetails || !bankDetails.accountType)) {
      return next(createError(400, 'Bank details required for bank account payment method'));
    }
    
    if (type === 'paypal' && (!paypalDetails || !paypalDetails.email)) {
      return next(createError(400, 'PayPal email required for PayPal payment method'));
    }
    
    // Get company
    const company = await Company.findById(req.user.company);
    if (!company) {
      return next(createError(404, 'Company not found'));
    }
    
    // In a real implementation, we would create a payment method with the payment processor
    // This is a placeholder for the actual implementation
    // const paymentMethodResponse = await createPaymentMethod(type, cardDetails || bankDetails || paypalDetails);
    
    // For demo purposes, we'll create a mock payment method
    const mockPaymentMethodId = 'pm_' + Math.random().toString(36).substring(2, 15);
    const mockCustomerId = 'cus_' + Math.random().toString(36).substring(2, 15);
    
    // Create payment method in database
    const paymentMethod = new PaymentMethod({
      company: company._id,
      type,
      cardDetails: type === 'credit_card' ? {
        brand: cardDetails.brand || 'visa',
        last4: cardDetails.last4 || '4242',
        expiryMonth: cardDetails.expiryMonth || 12,
        expiryYear: cardDetails.expiryYear || 2030,
        cardholderName: cardDetails.cardholderName
      } : undefined,
      bankDetails: type === 'bank_account' ? bankDetails : undefined,
      paypalDetails: type === 'paypal' ? paypalDetails : undefined,
      isDefault: true, // Make this the default payment method
      paymentMethodId: mockPaymentMethodId,
      customerId: mockCustomerId
    });
    
    // If this is the first payment method, make it default
    // Otherwise, check if it should be the default
    const existingPaymentMethods = await PaymentMethod.find({ company: company._id });
    
    if (existingPaymentMethods.length > 0) {
      // If this should be the default, update all others to not be default
      if (req.body.isDefault) {
        await PaymentMethod.updateMany(
          { company: company._id },
          { isDefault: false }
        );
      } else {
        // If not default and no other default exists, make this default
        const hasDefault = existingPaymentMethods.some(pm => pm.isDefault);
        paymentMethod.isDefault = !hasDefault;
      }
    }
    
    await paymentMethod.save();
    
    res.status(201).json({
      success: true,
      paymentMethod
    });
  } catch (error) {
    next(createError(500, 'Error adding payment method: ' + error.message));
  }
};

// Get payment methods
exports.getPaymentMethods = async (req, res, next) => {
  try {
    const paymentMethods = await PaymentMethod.find({ 
      company: req.user.company,
      isActive: true
    });
    
    res.status(200).json({
      success: true,
      count: paymentMethods.length,
      paymentMethods
    });
  } catch (error) {
    next(createError(500, 'Error fetching payment methods: ' + error.message));
  }
};

// Set default payment method
exports.setDefaultPaymentMethod = async (req, res, next) => {
  try {
    const { paymentMethodId } = req.params;
    
    // Find payment method
    const paymentMethod = await PaymentMethod.findOne({
      _id: paymentMethodId,
      company: req.user.company
    });
    
    if (!paymentMethod) {
      return next(createError(404, 'Payment method not found'));
    }
    
    // Update all payment methods to not be default
    await PaymentMethod.updateMany(
      { company: req.user.company },
      { isDefault: false }
    );
    
    // Set this payment method as default
    paymentMethod.isDefault = true;
    await paymentMethod.save();
    
    res.status(200).json({
      success: true,
      message: 'Default payment method updated successfully',
      paymentMethod
    });
  } catch (error) {
    next(createError(500, 'Error setting default payment method: ' + error.message));
  }
};

// Remove payment method
exports.removePaymentMethod = async (req, res, next) => {
  try {
    const { paymentMethodId } = req.params;
    
    // Find payment method
    const paymentMethod = await PaymentMethod.findOne({
      _id: paymentMethodId,
      company: req.user.company
    });
    
    if (!paymentMethod) {
      return next(createError(404, 'Payment method not found'));
    }
    
    // Check if this is the only payment method
    const paymentMethodCount = await PaymentMethod.countDocuments({
      company: req.user.company,
      isActive: true
    });
    
    if (paymentMethodCount === 1) {
      return next(createError(400, 'Cannot remove the only payment method'));
    }
    
    // Check if this is the default payment method
    if (paymentMethod.isDefault) {
      // Find another payment method to make default
      const anotherPaymentMethod = await PaymentMethod.findOne({
        company: req.user.company,
        _id: { $ne: paymentMethodId },
        isActive: true
      });
      
      if (anotherPaymentMethod) {
        anotherPaymentMethod.isDefault = true;
        await anotherPaymentMethod.save();
      }
    }
    
    // Soft delete the payment method
    paymentMethod.isActive = false;
    await paymentMethod.save();
    
    res.status(200).json({
      success: true,
      message: 'Payment method removed successfully'
    });
  } catch (error) {
    next(createError(500, 'Error removing payment method: ' + error.message));
  }
};

// Process payment
exports.processPayment = async (req, res, next) => {
  try {
    const { amount, currency, description, paymentMethodId } = req.body;
    
    // Validate required fields
    if (!amount || !currency) {
      return next(createError(400, 'Amount and currency are required'));
    }
    
    // Get company
    const company = await Company.findById(req.user.company);
    if (!company) {
      return next(createError(404, 'Company not found'));
    }
    
    // Get payment method
    let paymentMethod;
    if (paymentMethodId) {
      paymentMethod = await PaymentMethod.findOne({
        _id: paymentMethodId,
        company: company._id,
        isActive: true
      });
      
      if (!paymentMethod) {
        return next(createError(404, 'Payment method not found'));
      }
    } else {
      // Use default payment method
      paymentMethod = await PaymentMethod.findOne({
        company: company._id,
        isDefault: true,
        isActive: true
      });
      
      if (!paymentMethod) {
        return next(createError(404, 'No default payment method found'));
      }
    }
    
    // In a real implementation, we would process the payment with the payment processor
    // This is a placeholder for the actual implementation
    // const paymentResponse = await processPayment(
    //   paymentMethod.paymentMethodId,
    //   amount,
    //   currency,
    //   description
    // );
    
    // For demo purposes, we'll create a mock payment response
    const mockPaymentIntentId = 'pi_' + Math.random().toString(36).substring(2, 15);
    const mockChargeId = 'ch_' + Math.random().toString(36).substring(2, 15);
    const mockReceiptUrl = 'https://receipts.example.com/' + mockChargeId;
    
    // Create payment record
    const payment = new Payment({
      company: company._id,
      amount,
      currency,
      status: 'succeeded',
      paymentMethod: paymentMethod._id,
      paymentIntentId: mockPaymentIntentId,
      chargeId: mockChargeId,
      receiptUrl: mockReceiptUrl,
      description,
      billingDetails: {
        name: req.user.firstName + ' ' + req.user.lastName,
        email: req.user.email
      }
    });
    
    await payment.save();
    
    res.status(200).json({
      success: true,
      payment
    });
  } catch (error) {
    next(createError(500, 'Error processing payment: ' + error.message));
  }
};

// Get payment history
exports.getPaymentHistory = async (req, res, next) => {
  try {
    const payments = await Payment.find({ company: req.user.company })
      .populate('paymentMethod')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: payments.length,
      payments
    });
  } catch (error) {
    next(createError(500, 'Error fetching payment history: ' + error.message));
  }
};

// Get payment details
exports.getPaymentDetails = async (req, res, next) => {
  try {
    const { paymentId } = req.params;
    
    const payment = await Payment.findOne({
      _id: paymentId,
      company: req.user.company
    }).populate('paymentMethod');
    
    if (!payment) {
      return next(createError(404, 'Payment not found'));
    }
    
    res.status(200).json({
      success: true,
      payment
    });
  } catch (error) {
    next(createError(500, 'Error fetching payment details: ' + error.message));
  }
};
