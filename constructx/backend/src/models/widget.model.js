const mongoose = require("mongoose");

const widgetSchema = new mongoose.Schema({
    dashboardId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DashboardConfig",
        required: true,
    },
    type: {
        type: String,
        required: true,
        trim: true,
        // Example types: "MetricWidget", "ChartWidget", "TableWidget", "ListWidget", etc.
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    dataSource: {
        type: String,
        required: true,
        trim: true,
        // Example: "ProjectsModule/getProjectCount", "TasksModule/getOverdueTasks"
    },
    dataConfig: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
        default: {},
        // Example: { filters: { status: "Open" }, limit: 10 }
    },
    visualConfig: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
        default: {},
        // Example: { chartType: "bar", colorScheme: "blue" }
    },
    position: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
        default: { x: 0, y: 0, w: 4, h: 2 }, // Example grid position (adjust based on grid system)
    },
    refreshInterval: {
        type: Number, // in seconds
        required: true,
        default: 300, // Default to 5 minutes
    },
}, {
    timestamps: true,
});

widgetSchema.index({ dashboardId: 1 });

const Widget = mongoose.model("Widget", widgetSchema);

module.exports = Widget;

