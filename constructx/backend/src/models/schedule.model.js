const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema({
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
        default: "Main Schedule",
    },
    description: {
        type: String,
        trim: true,
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
    status: {
        type: String,
        required: true,
        enum: ["Draft", "Active", "Archived"],
        default: "Draft",
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
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
scheduleSchema.index({ projectId: 1, status: 1 });

// Ensure only one active schedule per project? Or allow multiple?
// For now, allowing multiple.

// Filter out soft-deleted documents by default
scheduleSchema.pre(/^find/, function(next) {
    if (this.getOptions().includeDeleted !== true) {
        this.where({ isDeleted: { $ne: true } });
    }
    next();
});

const Schedule = mongoose.model("Schedule", scheduleSchema);

module.exports = Schedule;

