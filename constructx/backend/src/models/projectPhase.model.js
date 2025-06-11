const mongoose = require("mongoose");

const projectPhaseSchema = new mongoose.Schema({
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
    description: {
        type: String,
        trim: true,
    },
    order: {
        type: Number,
        required: true,
        default: 0,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: ["Not Started", "In Progress", "Completed", "On Hold"],
        default: "Not Started",
    },
    completionPercentage: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
    },
    budget: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});

projectPhaseSchema.index({ projectId: 1, order: 1 });

const ProjectPhase = mongoose.model("ProjectPhase", projectPhaseSchema);

module.exports = ProjectPhase;

