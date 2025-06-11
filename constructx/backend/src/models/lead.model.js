const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema({
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        required: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    clientCompanyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company", // Assuming clients are also stored in Company or a separate Client model
        required: false,
    },
    source: {
        type: String,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    estimatedValue: {
        type: Number,
        default: 0,
    },
    estimatedStartDate: {
        type: Date,
    },
    estimatedDuration: {
        type: Number, // Store duration in a consistent unit, e.g., days
    },
    status: {
        type: String,
        required: true,
        enum: ["New", "Contacted", "Qualified", "Proposal", "Negotiation", "Won", "Lost"],
        default: "New",
    },
    probability: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    lastActivityAt: {
        type: Date,
    },
    tags: [{
        type: String,
        trim: true,
    }],
}, {
    timestamps: true,
});

leadSchema.index({ companyId: 1, status: 1 });
leadSchema.index({ assignedTo: 1 });

const Lead = mongoose.model("Lead", leadSchema);

module.exports = Lead;

