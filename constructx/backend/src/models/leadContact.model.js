const mongoose = require("mongoose");

const leadContactSchema = new mongoose.Schema({
    leadId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lead",
        required: true,
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        // Add email validation if needed
    },
    phone: {
        type: String,
        trim: true,
    },
    position: {
        type: String,
        trim: true,
    },
    isPrimary: {
        type: Boolean,
        default: false,
    },
    notes: {
        type: String,
        trim: true,
    },
}, {
    timestamps: true,
});

leadContactSchema.index({ leadId: 1 });

// Ensure only one primary contact per lead
leadContactSchema.index({ leadId: 1, isPrimary: 1 }, { unique: true, partialFilterExpression: { isPrimary: true } });

const LeadContact = mongoose.model("LeadContact", leadContactSchema);

module.exports = LeadContact;

