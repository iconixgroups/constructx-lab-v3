const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true,
    },
    budgetCategoryId: { // Optional link to a budget category
        type: mongoose.Schema.Types.ObjectId,
        ref: "BudgetCategory",
        required: false,
    },
    budgetItemId: { // Optional link to a specific budget item
        type: mongoose.Schema.Types.ObjectId,
        ref: "BudgetItem",
        required: false,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        required: true,
        default: Date.now,
    },
    vendor: {
        type: String,
        trim: true,
    },
    receiptUrl: {
        type: String,
        trim: true,
    },
    paymentMethod: {
        type: String,
        trim: true,
        // Example: "Credit Card", "Bank Transfer", "Cash", "Check"
    },
    paymentStatus: {
        type: String,
        required: true,
        enum: ["Pending", "Paid", "Overdue", "Cancelled"],
        default: "Pending",
    },
    approvalStatus: {
        type: String,
        required: true,
        enum: ["Pending", "Approved", "Rejected"],
        default: "Pending",
    },
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    approvedAt: {
        type: Date,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
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
expenseSchema.index({ projectId: 1, date: -1 });
expenseSchema.index({ projectId: 1, budgetCategoryId: 1 });
expenseSchema.index({ projectId: 1, budgetItemId: 1 });
expenseSchema.index({ projectId: 1, approvalStatus: 1 });
expenseSchema.index({ projectId: 1, paymentStatus: 1 });

// Filter out soft-deleted documents by default
expenseSchema.pre(/^find/, function(next) {
    if (this.getOptions().includeDeleted !== true) {
        this.where({ isDeleted: { $ne: true } });
    }
    next();
});

// TODO: Add pre-save hook to update budget category/item actuals if needed

const Expense = mongoose.model("Expense", expenseSchema);

module.exports = Expense;

