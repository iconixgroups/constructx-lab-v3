const mongoose = require("mongoose");

const scheduleItemSchema = new mongoose.Schema({
    scheduleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Schedule",
        required: true,
    },
    parentItemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ScheduleItem",
        required: false, // null for top-level items
    },
    taskId: { // Optional link to a Task in the Tasks module
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
        required: false,
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
    type: {
        type: String,
        required: true,
        enum: ["Milestone", "Task", "Phase", "Summary"],
        default: "Task",
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    baselineStartDate: {
        type: Date,
    },
    baselineEndDate: {
        type: Date,
    },
    duration: { // Duration in days (calculated or manually set)
        type: Number,
        required: true,
        default: 1,
    },
    completionPercentage: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
    },
    status: {
        type: String,
        required: true,
        enum: ["Not Started", "In Progress", "Completed", "On Hold", "Delayed"],
        default: "Not Started",
    },
    assignedTo: { // Optional assignment at the schedule level
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false,
    },
    order: { // Display order within the same parent level
        type: Number,
        required: true,
        default: 0,
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
scheduleItemSchema.index({ scheduleId: 1, parentItemId: 1, order: 1 });
scheduleItemSchema.index({ scheduleId: 1, taskId: 1 }); // If linking to tasks
scheduleItemSchema.index({ scheduleId: 1, startDate: 1 });

// Filter out soft-deleted documents by default
scheduleItemSchema.pre(/^find/, function(next) {
    if (this.getOptions().includeDeleted !== true) {
        this.where({ isDeleted: { $ne: true } });
    }
    next();
});

// Calculate duration before saving if start/end dates are set
scheduleItemSchema.pre("save", function(next) {
    if (this.endDate && this.startDate) {
        // Calculate duration in days (inclusive of start/end date, adjust as needed)
        const diffTime = Math.abs(this.endDate.getTime() - this.startDate.getTime());
        this.duration = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Example calculation
    }
    next();
});

const ScheduleItem = mongoose.model("ScheduleItem", scheduleItemSchema);

module.exports = ScheduleItem;

