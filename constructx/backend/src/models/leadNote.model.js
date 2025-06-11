const mongoose = require("mongoose");

const leadNoteSchema = new mongoose.Schema({
    leadId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lead",
        required: true,
    },
    content: {
        type: String,
        required: true,
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

leadNoteSchema.index({ leadId: 1, createdAt: -1 });

const LeadNote = mongoose.model("LeadNote", leadNoteSchema);

module.exports = LeadNote;

