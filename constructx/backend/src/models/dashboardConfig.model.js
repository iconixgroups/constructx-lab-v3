const mongoose = require("mongoose");

const dashboardConfigSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        required: true,
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: false, // Optional, for project-specific dashboards
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    isDefault: {
        type: Boolean,
        default: false,
    },
    layout: {
        type: mongoose.Schema.Types.Mixed, // Store layout configuration (e.g., grid positions)
        required: true,
        default: {},
    },
}, {
    timestamps: true,
});

// Ensure only one default dashboard per user/project scope
dashboardConfigSchema.index({ userId: 1, projectId: 1, isDefault: 1 }, { unique: true, partialFilterExpression: { isDefault: true } });
dashboardConfigSchema.index({ userId: 1, isDefault: 1 }, { unique: true, partialFilterExpression: { isDefault: true, projectId: null } });

const DashboardConfig = mongoose.model("DashboardConfig", dashboardConfigSchema);

module.exports = DashboardConfig;

