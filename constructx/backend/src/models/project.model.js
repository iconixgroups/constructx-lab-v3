const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        required: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    code: {
        type: String,
        required: true,
        unique: true, // Ensure project code is unique within the company
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company", // Assuming clients are also stored in Company or a separate Client model
        required: true,
    },
    contractId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Contract", // Link to the Contract model
        required: false,
    },
    status: {
        type: String,
        required: true,
        enum: ["Planning", "Active", "On Hold", "Completed", "Cancelled"],
        default: "Planning",
    },
    startDate: {
        type: Date,
        required: true,
    },
    targetCompletionDate: {
        type: Date,
        required: true,
    },
    actualCompletionDate: {
        type: Date,
    },
    budget: {
        type: Number,
        required: true,
        default: 0,
    },
    location: {
        type: String,
        trim: true,
    },
    address: {
        street: String,
        city: String,
        state: String,
        zip: String,
        country: String,
    },
    gpsCoordinates: {
        latitude: Number,
        longitude: Number,
    },
    projectType: {
        type: String,
        trim: true,
    },
    projectManager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    leadOriginId: { // Added based on lead conversion logic
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lead",
        required: false,
    },
    tags: [{
        type: String,
        trim: true,
    }],
    customFields: {
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

// Index for efficient querying
projectSchema.index({ companyId: 1, status: 1 });
projectSchema.index({ projectManager: 1 });
projectSchema.index({ clientId: 1 });
projectSchema.index({ code: 1, companyId: 1 }, { unique: true }); // Unique code per company

// Filter out soft-deleted documents by default
projectSchema.pre(/^find/, function(next) {
    if (this.getOptions().includeDeleted !== true) {
        this.where({ isDeleted: { $ne: true } });
    }
    next();
});

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;

