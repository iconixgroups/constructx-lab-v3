const mongoose = require("mongoose");

const scheduleDependencySchema = new mongoose.Schema({
    predecessorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ScheduleItem",
        required: true,
    },
    successorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ScheduleItem",
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
scheduleDependencySchema.index({ predecessorId: 1 });
scheduleDependencySchema.index({ successorId: 1 });
// Ensure a dependency pair is unique
scheduleDependencySchema.index({ predecessorId: 1, successorId: 1 }, { unique: true });

const ScheduleDependency = mongoose.model("ScheduleDependency", scheduleDependencySchema);

module.exports = ScheduleDependency;

