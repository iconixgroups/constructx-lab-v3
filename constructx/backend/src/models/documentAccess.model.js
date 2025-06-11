const mongoose = require("mongoose");

const documentAccessSchema = new mongoose.Schema({
    documentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Document",
        required: true,
    },
    userId: { // Grant access to a specific user
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false,
    },
    roleId: { // Grant access to users with a specific project role
        type: String, // Store the role name directly, assuming roles are managed elsewhere
        required: false,
    },
    accessLevel: {
        type: String,
        required: true,
        enum: ["View", "Comment", "Edit", "Approve", "Admin"],
        default: "View",
    },
    grantedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    expiresAt: {
        type: Date,
        required: false, // Optional: for temporary access
    },
}, {
    timestamps: { createdAt: "grantedAt", updatedAt: false }, // Use grantedAt for creation time
});

// Indexes
documentAccessSchema.index({ documentId: 1 });
documentAccessSchema.index({ userId: 1 });
documentAccessSchema.index({ roleId: 1 });

// Ensure unique access grant per user/role per document
documentAccessSchema.index({ documentId: 1, userId: 1 }, { unique: true, partialFilterExpression: { userId: { $ne: null } } });
documentAccessSchema.index({ documentId: 1, roleId: 1 }, { unique: true, partialFilterExpression: { roleId: { $ne: null } } });

// Validate that either userId or roleId is provided, but not both
documentAccessSchema.pre("validate", function(next) {
    if (!this.userId && !this.roleId) {
        next(new Error("Either userId or roleId must be provided for document access."));
    } else if (this.userId && this.roleId) {
        next(new Error("Provide either userId or roleId for document access, not both."));
    } else {
        next();
    }
});

const DocumentAccess = mongoose.model("DocumentAccess", documentAccessSchema);

module.exports = DocumentAccess;

