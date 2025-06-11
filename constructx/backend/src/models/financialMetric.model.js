const mongoose = require("mongoose");

const financialMetricSchema = new mongoose.Schema({
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
        // Example names: "Budget Variance", "Cost Performance Index (CPI)", "Schedule Performance Index (SPI)", "Earned Value (EV)", "Actual Cost (AC)"
    },
    value: {
        type: Number,
        required: true,
    },
    target: { // Optional target value for comparison
        type: Number,
    },
    unit: {
        type: String,
        trim: true,
        // Example units: "$", "%", "Index"
    },
    date: { // Date the metric was calculated or relevant to
        type: Date,
        required: true,
        default: Date.now,
    },
    category: {
        type: String,
        trim: true,
        // Example categories: "Cost", "Schedule", "Performance", "Profitability"
    },
    // No createdBy needed if these are system-calculated or aggregated
}, {
    timestamps: true,
});

// Indexes
financialMetricSchema.index({ projectId: 1, name: 1, date: -1 });
financialMetricSchema.index({ projectId: 1, category: 1, date: -1 });

const FinancialMetric = mongoose.model("FinancialMetric", financialMetricSchema);

module.exports = FinancialMetric;

