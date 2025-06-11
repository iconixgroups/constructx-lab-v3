const mongoose = require("mongoose");

const resourceAllocationSchema = new mongoose.Schema({
    resourceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Resource",
        required: true,
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true,
    },
    taskId: { // Optional link to a specific task
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
        required: false,
    },
    scheduleItemId: { // Optional link to a specific schedule item
        type: mongoose.Schema.Types.ObjectId,
        ref: "ScheduleItem",
        required: false,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    quantity: { // For material resources or fixed equipment allocation
        type: Number,
        required: true,
        default: 1,
    },
    utilization: { // Percentage for labor/equipment (e.g., 50% of their time)
        type: Number,
        min: 0,
        max: 100,
        required: false, // May not apply to materials
    },
    notes: {
        type: String,
        trim: true,
    },
    status: {
        type: String,
        required: true,
        enum: ["Planned", "Confirmed", "In Use", "Completed", "Cancelled"],
        default: "Planned",
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
resourceAllocationSchema.index({ resourceId: 1, startDate: 1, endDate: 1 });
resourceAllocationSchema.index({ projectId: 1, taskId: 1 });
resourceAllocationSchema.index({ projectId: 1, scheduleItemId: 1 });

// Validate that end date is after start date
resourceAllocationSchema.pre("validate", function(next) {
    if (this.endDate < this.startDate) {
        next(new Error("Allocation end date must be after start date."));
    } else {
        next();
    }
});

const ResourceAllocation = mongoose.model("ResourceAllocation", resourceAllocationSchema);

module.exports = ResourceAllocation;

