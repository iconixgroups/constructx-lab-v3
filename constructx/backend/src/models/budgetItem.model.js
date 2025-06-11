const mongoose = require("mongoose");

const budgetItemSchema = new mongoose.Schema({
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "BudgetCategory",
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
    quantity: {
        type: Number,
        required: true,
        default: 1,
    },
    unit: {
        type: String,
        required: true,
        trim: true,
    },
    unitPrice: {
        type: Number,
        required: true,
        default: 0,
    },
    totalPrice: { // Calculated: quantity * unitPrice
        type: Number,
        required: true,
        default: 0,
    },
    order: { // Display order within the category
        type: Number,
        required: true,
        default: 0,
    },
    // Add calculated fields if needed (e.g., actualAmount spent on this item)
}, {
    timestamps: true,
});

// Indexes
budgetItemSchema.index({ categoryId: 1, order: 1 });

// Ensure item name is unique within the same category
budgetItemSchema.index({ categoryId: 1, name: 1 }, { unique: true });

// Pre-save hook to calculate totalPrice
budgetItemSchema.pre("save", function(next) {
    if (this.isModified("quantity") || this.isModified("unitPrice")) {
        this.totalPrice = (this.quantity || 0) * (this.unitPrice || 0);
    }
    next();
});

// TODO: Add pre-save hook to update parent category amount if needed

const BudgetItem = mongoose.model("BudgetItem", budgetItemSchema);

module.exports = BudgetItem;

