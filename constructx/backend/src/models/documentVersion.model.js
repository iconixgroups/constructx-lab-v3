const mongoose = require("mongoose");

const documentVersionSchema = new mongoose.Schema({
    documentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Document",
        required: true,
    },
    versionNumber: {
        type: Number,
        required: true,
    },
    fileSize: {
        type: Number, // Size in bytes
        required: true,
    },
    filePath: {
        type: String, // Storage path for this specific version
        required: true,
    },
    changeDescription: {
        type: String,
        trim: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: ["Draft", "Under Review", "Approved", "Rejected"],
        default: "Draft",
    },
}, {
    timestamps: true,
});

// Indexes
documentVersionSchema.index({ documentId: 1, versionNumber: -1 }); // Get latest versions quickly

// Ensure version number is unique per document
documentVersionSchema.index({ documentId: 1, versionNumber: 1 }, { unique: true });

const DocumentVersion = mongoose.model("DocumentVersion", documentVersionSchema);

module.exports = DocumentVersion;

