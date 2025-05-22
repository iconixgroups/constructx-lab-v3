const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_your_test_key');

// Create a customer in Stripe
exports.createCustomer = async (email, name) => {
  try {
    const customer = await stripe.customers.create({
      email,
      name,
      metadata: {
        source: 'ConstructX Platform'
      }
    });
    
    return customer;
  } catch (error) {
    console.error('Error creating Stripe customer:', error);
    throw new Error('Failed to create payment customer');
  }
};

// Create a payment method in Stripe
exports.createPaymentMethod = async (type, details) => {
  try {
    // This is a simplified version - in production, you'd use Stripe Elements
    // on the frontend to securely collect payment details
    
    if (type === 'credit_card') {
      // In a real implementation, you'd use a token or payment method ID from the frontend
      const paymentMethod = await stripe.paymentMethods.create({
        type: 'card',
        card: {
          number: '4242424242424242', // Test card number
          exp_month: details.expiryMonth,
          exp_year: details.expiryYear,
          cvc: '123',
        },
        billing_details: {
          name: details.cardholderName,
        },
      });
      
      return paymentMethod;
    }
    
    throw new Error('Payment method type not supported');
  } catch (error) {
    console.error('Error creating payment method:', error);
    throw new Error('Failed to create payment method');
  }
};

// Attach payment method to customer
exports.attachPaymentMethodToCustomer = async (paymentMethodId, customerId) => {
  try {
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId,
    });
    
    // Set as default payment method
    await stripe.customers.update(customerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });
    
    return true;
  } catch (error) {
    console.error('Error attaching payment method to customer:', error);
    throw new Error('Failed to attach payment method to customer');
  }
};

// Create a subscription in Stripe
exports.createSubscription = async (customerId, planId, billingCycle) => {
  try {
    // Map our plan IDs to Stripe price IDs
    // In production, you'd store these mappings in a database
    const priceMap = {
      standard: {
        monthly: 'price_standard_monthly',
        annual: 'price_standard_annual'
      },
      professional: {
        monthly: 'price_professional_monthly',
        annual: 'price_professional_annual'
      },
      enterprise: {
        monthly: 'price_enterprise_monthly',
        annual: 'price_enterprise_annual'
      }
    };
    
    const priceId = priceMap[planId][billingCycle];
    
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [
        { price: priceId },
      ],
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent'],
    });
    
    return {
      id: subscription.id,
      clientSecret: subscription.latest_invoice.payment_intent.client_secret,
      status: subscription.status
    };
  } catch (error) {
    console.error('Error creating subscription:', error);
    throw new Error('Failed to create subscription');
  }
};

// Update a subscription in Stripe
exports.updateSubscription = async (subscriptionId, planId, billingCycle) => {
  try {
    // Map our plan IDs to Stripe price IDs
    const priceMap = {
      standard: {
        monthly: 'price_standard_monthly',
        annual: 'price_standard_annual'
      },
      professional: {
        monthly: 'price_professional_monthly',
        annual: 'price_professional_annual'
      },
      enterprise: {
        monthly: 'price_enterprise_monthly',
        annual: 'price_enterprise_annual'
      }
    };
    
    const priceId = priceMap[planId][billingCycle];
    
    // Get the subscription to find the current item ID
    const currentSubscription = await stripe.subscriptions.retrieve(subscriptionId);
    const itemId = currentSubscription.items.data[0].id;
    
    // Update the subscription
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      items: [
        {
          id: itemId,
          price: priceId,
        },
      ],
      proration_behavior: 'create_prorations',
    });
    
    return subscription;
  } catch (error) {
    console.error('Error updating subscription:', error);
    throw new Error('Failed to update subscription');
  }
};

// Cancel a subscription in Stripe
exports.cancelSubscription = async (subscriptionId) => {
  try {
    const subscription = await stripe.subscriptions.del(subscriptionId);
    return subscription;
  } catch (error) {
    console.error('Error canceling subscription:', error);
    throw new Error('Failed to cancel subscription');
  }
};

// Process a one-time payment
exports.processPayment = async (paymentMethodId, amount, currency, description) => {
  try {
    // Create a payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe uses cents
      currency: currency.toLowerCase(),
      payment_method: paymentMethodId,
      description,
      confirm: true,
      return_url: process.env.FRONTEND_URL || 'http://localhost:5173',
    });
    
    return {
      id: paymentIntent.id,
      status: paymentIntent.status,
      clientSecret: paymentIntent.client_secret,
      chargeId: paymentIntent.latest_charge,
      receiptUrl: `https://dashboard.stripe.com/receipts/${paymentIntent.latest_charge}`
    };
  } catch (error) {
    console.error('Error processing payment:', error);
    throw new Error('Failed to process payment');
  }
};

// Create a payment intent (for frontend confirmation)
exports.createPaymentIntent = async (amount, currency, customerId, description) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe uses cents
      currency: currency.toLowerCase(),
      customer: customerId,
      description,
      setup_future_usage: 'off_session',
    });
    
    return {
      id: paymentIntent.id,
      clientSecret: paymentIntent.client_secret
    };
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw new Error('Failed to create payment intent');
  }
};

// Get customer payment methods
exports.getCustomerPaymentMethods = async (customerId) => {
  try {
    const paymentMethods = await stripe.paymentMethods.list({
      customer: customerId,
      type: 'card',
    });
    
    return paymentMethods.data;
  } catch (error) {
    console.error('Error fetching customer payment methods:', error);
    throw new Error('Failed to fetch payment methods');
  }
};

// Detach payment method
exports.detachPaymentMethod = async (paymentMethodId) => {
  try {
    const paymentMethod = await stripe.paymentMethods.detach(paymentMethodId);
    return paymentMethod;
  } catch (error) {
    console.error('Error detaching payment method:', error);
    throw new Error('Failed to detach payment method');
  }
};
