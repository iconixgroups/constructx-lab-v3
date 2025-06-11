const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema({
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
    type: {
        type: String,
        required: true,
        enum: ["Labor", "Equipment", "Material"],
    },
    category: {
        type: String,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    status: {
        type: String,
        required: true,
        enum: ["Available", "Allocated", "Unavailable", "Maintenance"],
        default: "Available",
    },
    cost: {
        type: Number,
        required: true,
        default: 0,
    },
    costUnit: {
        type: String,
        required: true,
        enum: ["Hour", "Day", "Unit"],
        default: "Unit",
    },
    capacity: {
        type: Number,
    },
    capacityUnit: {
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
    isDeleted: { // For soft delete
        type: Boolean,
        default: false,
    },
    deletedAt: {
        type: Date,
    },
}, {
    timestamps: true,
    discriminatorKey: "type", // Key to differentiate subtypes
});

// Indexes
resourceSchema.index({ companyId: 1, type: 1, status: 1 });
resourceSchema.index({ companyId: 1, name: 1 });

// Filter out soft-deleted documents by default
resourceSchema.pre(/^find/, function(next) {
    if (this.getOptions().includeDeleted !== true) {
        this.where({ isDeleted: { $ne: true } });
    }
    next();
});

const Resource = mongoose.model("Resource", resourceSchema);

module.exports = Resource;

