const mongoose = require("mongoose");

const taskAttachmentSchema = new mongoose.Schema({
    taskId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
        required: true,
    },
    fileName: {
        type: String,
        required: true,
        trim: true,
    },
    fileSize: {
        type: Number, // Size in bytes
        required: true,
    },
    fileType: {
        type: String, // MIME type
        required: true,
        trim: true,
    },
    filePath: {
        type: String, // Path to the stored file (e.g., S3 URL or local path)
        required: true,
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, {
    timestamps: { createdAt: "uploadedAt", updatedAt: false }, // Use uploadedAt for creation time
});

// Index
taskAttachmentSchema.index({ taskId: 1 });

const TaskAttachment = mongoose.model("TaskAttachment", taskAttachmentSchema);

module.exports = TaskAttachment;

