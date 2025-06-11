const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true,
    },
    folderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Folder",
        required: false, // null if in project root
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
    fileSize: {
        type: Number, // Size in bytes of the latest version
        required: true,
    },
    fileType: {
        type: String, // MIME type of the latest version
        required: true,
        trim: true,
    },
    filePath: {
        type: String, // Storage path of the latest version
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: ["Draft", "Under Review", "Approved", "Rejected", "Archived"],
        default: "Draft",
    },
    category: {
        type: String,
        trim: true,
    },
    tags: [{
        type: String,
        trim: true,
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    latestVersionNumber: { // Track the latest version number
        type: Number,
        default: 1,
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {},
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
documentSchema.index({ projectId: 1, folderId: 1, name: 1 });
documentSchema.index({ projectId: 1, status: 1 });
documentSchema.index({ projectId: 1, category: 1 });
documentSchema.index({ tags: 1 });

// Ensure document name is unique within the same folder and project (for non-deleted docs)
documentSchema.index({ projectId: 1, folderId: 1, name: 1, isDeleted: 1 }, { unique: true, partialFilterExpression: { isDeleted: false } });

// Filter out soft-deleted documents by default
documentSchema.pre(/^find/, function(next) {
    if (this.getOptions().includeDeleted !== true) {
        this.where({ isDeleted: { $ne: true } });
    }
    next();
});

// Virtual to get the latest version (can be implemented if needed)
// documentSchema.virtual("latestVersion", {
//     ref: "DocumentVersion",
//     localField: "_id",
//     foreignField: "documentId",
//     justOne: true,
//     options: { sort: { versionNumber: -1 } }
// });

const Document = mongoose.model("Document", documentSchema);

module.exports = Document;

