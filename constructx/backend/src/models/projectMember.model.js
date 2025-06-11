const mongoose = require("mongoose");

const projectMemberSchema = new mongoose.Schema({
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    role: {
        type: String,
        required: true,
        trim: true,
        // Example roles: "Project Manager", "Superintendent", "Engineer", "Foreman", "Admin"
    },
    permissions: {
        type: mongoose.Schema.Types.Mixed,
        default: {},
        // Store module-specific permissions, e.g., { tasks: "edit", documents: "read" }
    },
    joinedAt: {
        type: Date,
        default: Date.now,
    },
    removedAt: {
        type: Date,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, {
    timestamps: true,
});

// Ensure a user has only one role per project
projectMemberSchema.index({ projectId: 1, userId: 1 }, { unique: true });

const ProjectMember = mongoose.model("ProjectMember", projectMemberSchema);

module.exports = ProjectMember;

