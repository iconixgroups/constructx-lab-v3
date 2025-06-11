const mongoose = require("mongoose");

const leadActivitySchema = new mongoose.Schema({
    leadId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lead",
        required: true,
    },
    type: {
        type: String,
        required: true,
        enum: ["Call", "Email", "Meeting", "Note", "Task", "Document"],
    },
    title: {
        type: String,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    performedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    performedAt: {
        type: Date,
        default: Date.now,
    },
    scheduledAt: {
        type: Date, // For planned future activities
    },
    outcome: {
        type: String,
        trim: true,
    },
    documentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Document", // Link to a document if activity type is Document
        required: false,
    },
}, {
    timestamps: true,
});

leadActivitySchema.index({ leadId: 1, performedAt: -1 });

const LeadActivity = mongoose.model("LeadActivity", leadActivitySchema);

module.exports = LeadActivity;

