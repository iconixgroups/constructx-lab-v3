const mongoose = require("mongoose");

const taskDependencySchema = new mongoose.Schema({
    predecessorTaskId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
        required: true,
    },
    successorTaskId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
        required: true,
    },
    type: {
        type: String,
        required: true,
        enum: ["Finish-to-Start", "Start-to-Start", "Finish-to-Finish", "Start-to-Finish"],
        default: "Finish-to-Start",
    },
    lag: {
        type: Number, // Duration in days
        default: 0,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, {
    timestamps: true,
});

// Indexes
taskDependencySchema.index({ predecessorTaskId: 1 });
taskDependencySchema.index({ successorTaskId: 1 });
// Ensure a dependency pair is unique
taskDependencySchema.index({ predecessorTaskId: 1, successorTaskId: 1 }, { unique: true });

const TaskDependency = mongoose.model("TaskDependency", taskDependencySchema);

module.exports = TaskDependency;

