const mongoose = require("mongoose");

const budgetCategorySchema = new mongoose.Schema({
    budgetId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Budget",
        required: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    amount: { // Budgeted amount for this category
        type: Number,
        required: true,
        default: 0,
    },
    parentCategoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "BudgetCategory",
        required: false, // null for top-level categories
    },
    order: { // Display order within the same parent level
        type: Number,
        required: true,
        default: 0,
    },
    // Add calculated fields if needed (e.g., actualAmount spent in this category)
}, {
    timestamps: true,
});

// Indexes
budgetCategorySchema.index({ budgetId: 1, parentCategoryId: 1, order: 1 });

// Ensure category name is unique within the same parent category and budget
budgetCategorySchema.index({ budgetId: 1, parentCategoryId: 1, name: 1 }, { unique: true });

// TODO: Add pre-save hook to update parent category amount or budget totalAmount if needed

const BudgetCategory = mongoose.model("BudgetCategory", budgetCategorySchema);

module.exports = BudgetCategory;

