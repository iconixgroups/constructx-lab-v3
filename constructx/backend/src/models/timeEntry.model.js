const mongoose = require("mongoose");

const timeEntrySchema = new mongoose.Schema({
    taskId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    description: {
        type: String,
        trim: true,
    },
    startTime: {
        type: Date,
        required: true,
    },
    endTime: {
        type: Date,
        // required: true, // Not required if timer is still running
    },
    duration: {
        type: Number, // Duration in minutes
        required: true,
        default: 0,
    },
    billable: {
        type: Boolean,
        default: false,
    },
    isRunning: { // Added to track active timers
        type: Boolean,
        default: false,
    }
}, {
    timestamps: true,
});

// Index
timeEntrySchema.index({ taskId: 1 });
timeEntrySchema.index({ userId: 1, startTime: -1 });

// Calculate duration before saving if endTime is set
timeEntrySchema.pre("save", function(next) {
    if (this.endTime && this.startTime) {
        this.duration = Math.round((this.endTime.getTime() - this.startTime.getTime()) / (1000 * 60)); // Duration in minutes
        this.isRunning = false;
    } else if (this.startTime && !this.endTime) {
        this.isRunning = true;
        // Optionally calculate duration up to now if needed, but usually done on stop
    }
    next();
});

const TimeEntry = mongoose.model("TimeEntry", timeEntrySchema);

module.exports = TimeEntry;

