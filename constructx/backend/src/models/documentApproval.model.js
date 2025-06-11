const mongoose = require("mongoose");

const documentApprovalSchema = new mongoose.Schema({
    documentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Document",
        required: true,
    },
    versionId: { // Approval is usually tied to a specific version
        type: mongoose.Schema.Types.ObjectId,
        ref: "DocumentVersion",
        required: true,
    },
    approverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: ["Pending", "Approved", "Rejected", "Revise"],
        default: "Pending",
    },
    comments: {
        type: String,
        trim: true,
    },
    requestedAt: {
        type: Date,
        default: Date.now,
    },
    respondedAt: {
        type: Date,
    },
    requestedBy: { // Added: Who initiated the approval request
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, {
    timestamps: true,
});

// Indexes
documentApprovalSchema.index({ documentId: 1, versionId: 1 });
documentApprovalSchema.index({ approverId: 1, status: 1 });

// Ensure one approval request per user per version
documentApprovalSchema.index({ versionId: 1, approverId: 1 }, { unique: true });

const DocumentApproval = mongoose.model("DocumentApproval", documentApprovalSchema);

module.exports = DocumentApproval;

