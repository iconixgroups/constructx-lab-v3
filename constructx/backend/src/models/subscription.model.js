const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  plan: {
    type: String,
    enum: ['standard', 'professional', 'enterprise'],
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'trialing', 'past_due', 'canceled', 'incomplete'],
    default: 'trialing'
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date,
    required: true
  },
  trialEndsAt: {
    type: Date
  },
  billingCycle: {
    type: String,
    enum: ['monthly', 'annual'],
    default: 'monthly'
  },
  price: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'USD'
  },
  paymentMethod: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PaymentMethod'
  },
  limits: {
    users: {
      type: Number,
      required: true
    },
    projects: {
      type: Number,
      required: true
    },
    storage: {
      type: Number, // in GB
      required: true
    }
  },
  features: {
    type: Map,
    of: Boolean
  },
  paymentIntentId: String,
  subscriptionId: String,
  customerId: String,
  canceledAt: Date,
  cancelReason: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Method to check if subscription is active
subscriptionSchema.methods.isActive = function() {
  return (this.status === 'active' || this.status === 'trialing') && 
         this.endDate > new Date();
};

// Method to check if subscription is in trial period
subscriptionSchema.methods.isInTrial = function() {
  return this.status === 'trialing' && 
         this.trialEndsAt && 
         this.trialEndsAt > new Date();
};

// Method to check if a feature is enabled for this subscription
subscriptionSchema.methods.hasFeature = function(featureName) {
  return this.features && this.features.get(featureName) === true;
};

// Method to check if subscription has reached user limit
subscriptionSchema.methods.hasReachedUserLimit = function(currentUserCount) {
  return currentUserCount >= this.limits.users;
};

// Method to check if subscription has reached project limit
subscriptionSchema.methods.hasReachedProjectLimit = function(currentProjectCount) {
  return currentProjectCount >= this.limits.projects;
};

const Subscription = mongoose.model('Subscription', subscriptionSchema);

module.exports = Subscription;
