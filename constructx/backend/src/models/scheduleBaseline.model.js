const mongoose = require("mongoose");

const scheduleBaselineSchema = new mongoose.Schema({
    scheduleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Schedule",
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
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    // Store the baseline data itself - snapshot of ScheduleItems at the time of creation
    // This could be a large embedded array or stored in a separate collection referenced here.
    // Storing as Mixed for flexibility, but consider performance implications.
    baselineData: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
        default: [], // Array of baseline item snapshots
        /* Example structure for an item snapshot:
        {
            originalItemId: ObjectId,
            name: String,
            type: String,
            startDate: Date,
            endDate: Date,
            duration: Number,
            // ... other relevant fields
        }
        */
    },
}, {
    timestamps: true,
});

// Indexes
scheduleBaselineSchema.index({ scheduleId: 1, createdAt: -1 });

const ScheduleBaseline = mongoose.model("ScheduleBaseline", scheduleBaselineSchema);

module.exports = ScheduleBaseline;

