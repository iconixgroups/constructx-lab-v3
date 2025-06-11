const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true,
    },
    phaseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ProjectPhase",
        required: false,
    },
    parentTaskId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
        required: false,
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    status: {
        type: String,
        required: true,
        enum: ["Not Started", "In Progress", "On Hold", "Completed", "Cancelled"],
        default: "Not Started",
    },
    priority: {
        type: String,
        required: true,
        enum: ["Low", "Medium", "High", "Critical"],
        default: "Medium",
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    dueDate: {
        type: Date,
        required: true,
    },
    completedDate: {
        type: Date,
    },
    estimatedHours: {
        type: Number,
        default: 0,
    },
    actualHours: {
        type: Number,
        default: 0,
    },
    completionPercentage: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
    },
    tags: [{
        type: String,
        trim: true,
    }],
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
taskSchema.index({ projectId: 1, status: 1 });
taskSchema.index({ assignedTo: 1 });
taskSchema.index({ parentTaskId: 1 });
taskSchema.index({ dueDate: 1 });

// Filter out soft-deleted documents by default
taskSchema.pre(/^find/, function(next) {
    if (this.getOptions().includeDeleted !== true) {
        this.where({ isDeleted: { $ne: true } });
    }
    next();
});

// Method to calculate actualHours from time entries (can be added later if needed)
// taskSchema.methods.calculateActualHours = async function() {
//     const timeEntries = await mongoose.model("TimeEntry").find({ taskId: this._id });
//     this.actualHours = timeEntries.reduce((sum, entry) => sum + (entry.duration / 60), 0); // Assuming duration is in minutes
//     await this.save();
// };

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;

