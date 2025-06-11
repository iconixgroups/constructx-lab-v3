const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema({
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
        default: "Project Budget",
    },
    description: {
        type: String,
        trim: true,
    },
    totalAmount: {
        type: Number,
        required: true,
        default: 0,
    },
    status: {
        type: String,
        required: true,
        enum: ["Draft", "Approved", "Active", "Closed"],
        default: "Draft",
    },
    startDate: {
        type: Date,
    },
    endDate: {
        type: Date,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    approvedAt: {
        type: Date,
    },
    isDeleted: { // For soft delete
        type: Boolean,
        default: false,
    },
    deletedAt: {
        type: Date,
    },
}, {
    timestamps: true,
});

// Indexes
budgetSchema.index({ projectId: 1, status: 1 });

// Filter out soft-deleted documents by default
budgetSchema.pre(/^find/, function(next) {
    if (this.getOptions().includeDeleted !== true) {
        this.where({ isDeleted: { $ne: true } });
    }
    next();
});

// TODO: Add pre-save hook to calculate totalAmount from categories/items if needed

const Budget = mongoose.model("Budget", budgetSchema);

module.exports = Budget;

