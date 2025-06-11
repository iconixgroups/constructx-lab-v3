const mongoose = require("mongoose");

const financialReportSchema = new mongoose.Schema({
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true,
    },
    type: {
        type: String,
        required: true,
        enum: ["Budget Summary", "Expense Report", "Cash Flow", "Profit/Loss", "Custom"],
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
    dateRange: {
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
    },
    data: { // Stores the generated report data (e.g., JSON for charts/tables)
        type: mongoose.Schema.Types.Mixed,
        required: true,
        default: {},
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
financialReportSchema.index({ projectId: 1, type: 1, createdAt: -1 });

// Filter out soft-deleted documents by default
financialReportSchema.pre(/^find/, function(next) {
    if (this.getOptions().includeDeleted !== true) {
        this.where({ isDeleted: { $ne: true } });
    }
    next();
});

const FinancialReport = mongoose.model("FinancialReport", financialReportSchema);

module.exports = FinancialReport;

