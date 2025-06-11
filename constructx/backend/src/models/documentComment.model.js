const mongoose = require("mongoose");

const documentCommentSchema = new mongoose.Schema({
    documentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Document",
        required: true,
    },
    versionId: { // Optional: Link comment to a specific version
        type: mongoose.Schema.Types.ObjectId,
        ref: "DocumentVersion",
        required: false,
    },
    content: {
        type: String,
        required: true,
        trim: true,
    },
    position: { // Optional: For positioned comments on previews (e.g., PDF coordinates)
        x: Number,
        y: Number,
        page: Number,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, {
    timestamps: true,
});

// Index
documentCommentSchema.index({ documentId: 1, createdAt: 1 });

const DocumentComment = mongoose.model("DocumentComment", documentCommentSchema);

module.exports = DocumentComment;

