const mongoose = require("mongoose");

const folderSchema = new mongoose.Schema({
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true,
    },
    parentFolderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Folder",
        required: false, // null for root folders within a project
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
folderSchema.index({ projectId: 1, parentFolderId: 1, name: 1 }); // Index for finding folders within a parent

// Ensure folder name is unique within the same parent folder and project
folderSchema.index({ projectId: 1, parentFolderId: 1, name: 1, isDeleted: 1 }, { unique: true, partialFilterExpression: { isDeleted: false } });

// Filter out soft-deleted documents by default
folderSchema.pre(/^find/, function(next) {
    if (this.getOptions().includeDeleted !== true) {
        this.where({ isDeleted: { $ne: true } });
    }
    next();
});

const Folder = mongoose.model("Folder", folderSchema);

module.exports = Folder;

