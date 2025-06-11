const mongoose = require("mongoose");

const resourceAvailabilitySchema = new mongoose.Schema({
    resourceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Resource",
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    reason: {
        type: String,
        required: true,
        trim: true,
        // Example reasons: "Vacation", "Maintenance", "Reserved", "Training", "Sick Leave"
    },
    notes: {
        type: String,
        trim: true,
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
resourceAvailabilitySchema.index({ resourceId: 1, startDate: 1, endDate: 1 });

// Validate that end date is after start date
resourceAvailabilitySchema.pre("validate", function(next) {
    if (this.endDate < this.startDate) {
        next(new Error("Availability end date must be after start date."));
    } else {
        next();
    }
});

const ResourceAvailability = mongoose.model("ResourceAvailability", resourceAvailabilitySchema);

module.exports = ResourceAvailability;

