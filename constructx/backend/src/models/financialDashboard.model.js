const mongoose = require("mongoose");

const financialDashboardSchema = new mongoose.Schema({
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true,
        unique: true, // Assuming one financial dashboard per project
    },
    name: {
        type: String,
        required: true,
        trim: true,
        default: "Financial Dashboard",
    },
    description: {
        type: String,
        trim: true,
    },
    layout: { // Stores widget configuration and positions
        type: mongoose.Schema.Types.Mixed,
        default: {},
        /* Example layout:
        {
            widgets: [
                { id: "kpi1", type: "Metric", metricName: "Total Budget", position: { x: 0, y: 0, w: 2, h: 1 } },
                { id: "chart1", type: "BudgetVsActual", position: { x: 2, y: 0, w: 4, h: 2 } },
                { id: "list1", type: "RecentExpenses", position: { x: 0, y: 1, w: 2, h: 2 } }
            ]
        }
        */
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, {
    timestamps: true,
});

// Index
financialDashboardSchema.index({ projectId: 1 });

const FinancialDashboard = mongoose.model("FinancialDashboard", financialDashboardSchema);

module.exports = FinancialDashboard;

