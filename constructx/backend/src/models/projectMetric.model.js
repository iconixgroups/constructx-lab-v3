const mongoose = require("mongoose");

const projectMetricSchema = new mongoose.Schema({
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    category: {
        type: String,
        required: true,
        trim: true,
        // Example categories: "Financial", "Schedule", "Quality", "Safety"
    },
    value: {
        type: Number,
        required: true,
    },
    target: {
        type: Number,
    },
    unit: {
        type: String,
        trim: true,
    },
    date: {
        type: Date,
        required: true,
        default: Date.now,
    },
}, {
    timestamps: true,
});

projectMetricSchema.index({ projectId: 1, category: 1, date: -1 });

const ProjectMetric = mongoose.model("ProjectMetric", projectMetricSchema);

module.exports = ProjectMetric;

