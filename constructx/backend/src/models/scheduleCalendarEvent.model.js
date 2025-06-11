const mongoose = require("mongoose");

const scheduleCalendarEventSchema = new mongoose.Schema({
    scheduleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Schedule",
        required: true,
    },
    scheduleItemId: { // Optional link to a specific schedule item
        type: mongoose.Schema.Types.ObjectId,
        ref: "ScheduleItem",
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
    startDateTime: {
        type: Date,
        required: true,
    },
    endDateTime: {
        type: Date,
        required: true,
    },
    allDay: {
        type: Boolean,
        default: false,
    },
    location: {
        type: String,
        trim: true,
    },
    type: {
        type: String,
        trim: true,
        // Example types: "Meeting", "Deadline", "Delivery", "Inspection"
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
scheduleCalendarEventSchema.index({ scheduleId: 1, startDateTime: 1 });
scheduleCalendarEventSchema.index({ scheduleItemId: 1 });

const ScheduleCalendarEvent = mongoose.model("ScheduleCalendarEvent", scheduleCalendarEventSchema);

module.exports = ScheduleCalendarEvent;

