const mongoose = require('mongoose');

const paymentMethodSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  type: {
    type: String,
    enum: ['credit_card', 'bank_account', 'paypal'],
    required: true
  },
  // For credit cards
  cardDetails: {
    brand: String,
    last4: String,
    expiryMonth: Number,
    expiryYear: Number,
    cardholderName: String
  },
  // For bank accounts
  bankDetails: {
    bankName: String,
    accountType: String,
    last4: String,
    routingNumber: String
  },
  // For PayPal
  paypalDetails: {
    email: String
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  paymentMethodId: String, // ID from payment processor
  customerId: String, // Customer ID from payment processor
  isActive: {
    type: Boolean,
    default: true
  },
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

const PaymentMethod = mongoose.model('PaymentMethod', paymentMethodSchema);

module.exports = PaymentMethod;
