const Subscription = require('../models/subscription.model');
const Company = require('../models/company.model');
const PaymentMethod = require('../models/paymentMethod.model');
const Payment = require('../models/payment.model');
const { createError } = require('../utils/error');
const { createCustomer, createSubscription, updateSubscription, cancelSubscription } = require('../services/payment.service');

// Get subscription plans
exports.getPlans = async (req, res, next) => {
  try {
    // These would typically come from a database or configuration
    const plans = [
      {
        id: 'standard',
        name: 'Standard',
        description: 'For small teams getting started',
        monthly: {
          price: 49,
          currency: 'USD'
        },
        annual: {
          price: 470,
          currency: 'USD',
          savings: 118
        },
        limits: {
          users: 5,
          projects: 3,
          storage: 10
        },
        features: {
          documentManagement: true,
          projectManagement: true,
          teamManagement: true,
          basicReporting: true,
          emailSupport: true,
          advancedReporting: false,
          aiFeatures: false,
          prioritySupport: false,
          customIntegrations: false
        }
      },
      {
        id: 'professional',
        name: 'Professional',
        description: 'For growing businesses',
        recommended: true,
        monthly: {
          price: 99,
          currency: 'USD'
        },
        annual: {
          price: 950,
          currency: 'USD',
          savings: 238
        },
        limits: {
          users: 15,
          projects: 10,
          storage: 50
        },
        features: {
          documentManagement: true,
          projectManagement: true,
          teamManagement: true,
          basicReporting: true,
          emailSupport: true,
          advancedReporting: true,
          aiFeatures: true,
          prioritySupport: true,
          customIntegrations: false
        }
      },
      {
        id: 'enterprise',
        name: 'Enterprise',
        description: 'For large organizations',
        monthly: {
          price: 249,
          currency: 'USD'
        },
        annual: {
          price: 2390,
          currency: 'USD',
          savings: 598
        },
        limits: {
          users: 'Unlimited',
          projects: 'Unlimited',
          storage: 250
        },
        features: {
          documentManagement: true,
          projectManagement: true,
          teamManagement: true,
          basicReporting: true,
          emailSupport: true,
          advancedReporting: true,
          aiFeatures: true,
          prioritySupport: true,
          customIntegrations: true
        }
      }
    ];
    
    res.status(200).json({
      success: true,
      plans
    });
  } catch (error) {
    next(createError(500, 'Error fetching subscription plans: ' + error.message));
  }
};

// Create a new subscription
exports.createSubscription = async (req, res, next) => {
  try {
    const { planId, billingCycle, paymentMethodId } = req.body;
    
    // Validate plan
    const plans = {
      standard: {
        monthly: { price: 49, users: 5, projects: 3, storage: 10 },
        annual: { price: 470, users: 5, projects: 3, storage: 10 }
      },
      professional: {
        monthly: { price: 99, users: 15, projects: 10, storage: 50 },
        annual: { price: 950, users: 15, projects: 10, storage: 50 }
      },
      enterprise: {
        monthly: { price: 249, users: 100, projects: 100, storage: 250 },
        annual: { price: 2390, users: 100, projects: 100, storage: 250 }
      }
    };
    
    if (!plans[planId]) {
      return next(createError(400, 'Invalid subscription plan'));
    }
    
    if (billingCycle !== 'monthly' && billingCycle !== 'annual') {
      return next(createError(400, 'Invalid billing cycle'));
    }
    
    // Get company
    const company = await Company.findById(req.user.company);
    if (!company) {
      return next(createError(404, 'Company not found'));
    }
    
    // Check if company already has a subscription
    if (company.subscription) {
      return next(createError(400, 'Company already has an active subscription'));
    }
    
    // Get payment method
    let paymentMethod;
    if (paymentMethodId) {
      paymentMethod = await PaymentMethod.findOne({
        _id: paymentMethodId,
        company: company._id
      });
      
      if (!paymentMethod) {
        return next(createError(404, 'Payment method not found'));
      }
    }
    
    // Calculate subscription details
    const planDetails = plans[planId][billingCycle];
    const price = planDetails.price;
    const startDate = new Date();
    const endDate = new Date();
    
    if (billingCycle === 'monthly') {
      endDate.setMonth(endDate.getMonth() + 1);
    } else {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }
    
    // Create trial subscription (no payment required for trial)
    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + 30); // 30-day trial
    
    const subscription = new Subscription({
      plan: planId,
      status: 'trialing',
      company: company._id,
      startDate,
      endDate: trialEndsAt, // During trial, end date is trial end date
      trialEndsAt,
      billingCycle,
      price,
      currency: 'USD',
      paymentMethod: paymentMethod ? paymentMethod._id : null,
      limits: {
        users: planDetails.users,
        projects: planDetails.projects,
        storage: planDetails.storage
      },
      features: {
        documentManagement: true,
        projectManagement: true,
        teamManagement: true,
        basicReporting: true,
        emailSupport: true,
        advancedReporting: planId !== 'standard',
        aiFeatures: planId !== 'standard',
        prioritySupport: planId !== 'standard',
        customIntegrations: planId === 'enterprise'
      }
    });
    
    // Save subscription
    await subscription.save();
    
    // Update company with subscription
    company.subscription = subscription._id;
    await company.save();
    
    res.status(201).json({
      success: true,
      subscription,
      trialEndsAt
    });
  } catch (error) {
    next(createError(500, 'Error creating subscription: ' + error.message));
  }
};

// Get current subscription
exports.getCurrentSubscription = async (req, res, next) => {
  try {
    // Get company with populated subscription
    const company = await Company.findById(req.user.company).populate('subscription');
    
    if (!company) {
      return next(createError(404, 'Company not found'));
    }
    
    if (!company.subscription) {
      return next(createError(404, 'No active subscription found'));
    }
    
    res.status(200).json({
      success: true,
      subscription: company.subscription
    });
  } catch (error) {
    next(createError(500, 'Error fetching subscription: ' + error.message));
  }
};

// Update subscription (change plan)
exports.updateSubscription = async (req, res, next) => {
  try {
    const { planId, billingCycle } = req.body;
    
    // Validate plan
    const plans = {
      standard: {
        monthly: { price: 49, users: 5, projects: 3, storage: 10 },
        annual: { price: 470, users: 5, projects: 3, storage: 10 }
      },
      professional: {
        monthly: { price: 99, users: 15, projects: 10, storage: 50 },
        annual: { price: 950, users: 15, projects: 10, storage: 50 }
      },
      enterprise: {
        monthly: { price: 249, users: 100, projects: 100, storage: 250 },
        annual: { price: 2390, users: 100, projects: 100, storage: 250 }
      }
    };
    
    if (!plans[planId]) {
      return next(createError(400, 'Invalid subscription plan'));
    }
    
    if (billingCycle !== 'monthly' && billingCycle !== 'annual') {
      return next(createError(400, 'Invalid billing cycle'));
    }
    
    // Get company with populated subscription
    const company = await Company.findById(req.user.company).populate('subscription');
    
    if (!company) {
      return next(createError(404, 'Company not found'));
    }
    
    if (!company.subscription) {
      return next(createError(404, 'No active subscription found'));
    }
    
    const subscription = company.subscription;
    
    // Calculate new subscription details
    const planDetails = plans[planId][billingCycle];
    const price = planDetails.price;
    const endDate = new Date();
    
    if (billingCycle === 'monthly') {
      endDate.setMonth(endDate.getMonth() + 1);
    } else {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }
    
    // If subscription is in trial, keep it in trial
    if (subscription.status === 'trialing') {
      subscription.plan = planId;
      subscription.billingCycle = billingCycle;
      subscription.price = price;
      subscription.limits = {
        users: planDetails.users,
        projects: planDetails.projects,
        storage: planDetails.storage
      };
      subscription.features = {
        documentManagement: true,
        projectManagement: true,
        teamManagement: true,
        basicReporting: true,
        emailSupport: true,
        advancedReporting: planId !== 'standard',
        aiFeatures: planId !== 'standard',
        prioritySupport: planId !== 'standard',
        customIntegrations: planId === 'enterprise'
      };
      
      await subscription.save();
      
      return res.status(200).json({
        success: true,
        message: 'Subscription updated successfully',
        subscription
      });
    }
    
    // For active subscriptions, we would update the subscription with the payment processor
    // This is a placeholder for the actual implementation
    // const updatedSubscription = await updateSubscription(subscription.subscriptionId, planId, billingCycle);
    
    // Update subscription in database
    subscription.plan = planId;
    subscription.billingCycle = billingCycle;
    subscription.price = price;
    subscription.endDate = endDate;
    subscription.limits = {
      users: planDetails.users,
      projects: planDetails.projects,
      storage: planDetails.storage
    };
    subscription.features = {
      documentManagement: true,
      projectManagement: true,
      teamManagement: true,
      basicReporting: true,
      emailSupport: true,
      advancedReporting: planId !== 'standard',
      aiFeatures: planId !== 'standard',
      prioritySupport: planId !== 'standard',
      customIntegrations: planId === 'enterprise'
    };
    
    await subscription.save();
    
    res.status(200).json({
      success: true,
      message: 'Subscription updated successfully',
      subscription
    });
  } catch (error) {
    next(createError(500, 'Error updating subscription: ' + error.message));
  }
};

// Cancel subscription
exports.cancelSubscription = async (req, res, next) => {
  try {
    // Get company with populated subscription
    const company = await Company.findById(req.user.company).populate('subscription');
    
    if (!company) {
      return next(createError(404, 'Company not found'));
    }
    
    if (!company.subscription) {
      return next(createError(404, 'No active subscription found'));
    }
    
    const subscription = company.subscription;
    
    // For active subscriptions, we would cancel the subscription with the payment processor
    // This is a placeholder for the actual implementation
    // const canceledSubscription = await cancelSubscription(subscription.subscriptionId);
    
    // Update subscription in database
    subscription.status = 'canceled';
    subscription.canceledAt = Date.now();
    subscription.cancelReason = req.body.reason || 'User canceled';
    
    await subscription.save();
    
    res.status(200).json({
      success: true,
      message: 'Subscription canceled successfully'
    });
  } catch (error) {
    next(createError(500, 'Error canceling subscription: ' + error.message));
  }
};

// Convert trial to paid subscription
exports.convertTrialToPaid = async (req, res, next) => {
  try {
    const { paymentMethodId } = req.body;
    
    // Get company with populated subscription
    const company = await Company.findById(req.user.company).populate('subscription');
    
    if (!company) {
      return next(createError(404, 'Company not found'));
    }
    
    if (!company.subscription) {
      return next(createError(404, 'No active subscription found'));
    }
    
    const subscription = company.subscription;
    
    if (subscription.status !== 'trialing') {
      return next(createError(400, 'Subscription is not in trial period'));
    }
    
    // Get payment method
    const paymentMethod = await PaymentMethod.findOne({
      _id: paymentMethodId,
      company: company._id
    });
    
    if (!paymentMethod) {
      return next(createError(404, 'Payment method not found'));
    }
    
    // Calculate new end date based on billing cycle
    const endDate = new Date();
    
    if (subscription.billingCycle === 'monthly') {
      endDate.setMonth(endDate.getMonth() + 1);
    } else {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }
    
    // For real implementation, we would create a subscription with the payment processor
    // This is a placeholder for the actual implementation
    // const paidSubscription = await createSubscription(
    //   paymentMethod.customerId,
    //   subscription.plan,
    //   subscription.billingCycle
    // );
    
    // Create a payment record
    const payment = new Payment({
      company: company._id,
      subscription: subscription._id,
      amount: subscription.price,
      currency: subscription.currency,
      status: 'succeeded',
      paymentMethod: paymentMethod._id,
      description: `Subscription payment for ${subscription.plan} plan (${subscription.billingCycle})`,
      // paymentIntentId: paidSubscription.paymentIntentId,
      // chargeId: paidSubscription.chargeId,
      billingDetails: {
        name: req.user.firstName + ' ' + req.user.lastName,
        email: req.user.email
      }
    });
    
    await payment.save();
    
    // Update subscription
    subscription.status = 'active';
    subscription.endDate = endDate;
    subscription.paymentMethod = paymentMethod._id;
    // subscription.subscriptionId = paidSubscription.id;
    // subscription.customerId = paymentMethod.customerId;
    
    await subscription.save();
    
    res.status(200).json({
      success: true,
      message: 'Trial converted to paid subscription successfully',
      subscription,
      payment
    });
  } catch (error) {
    next(createError(500, 'Error converting trial to paid subscription: ' + error.message));
  }
};
