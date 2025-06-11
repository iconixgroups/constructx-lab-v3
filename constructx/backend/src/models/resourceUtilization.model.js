const mongoose = require("mongoose");

const resourceUtilizationSchema = new mongoose.Schema({
    resourceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Resource",
        required: true,
    },
    projectId: { // Optional: Track utilization against a specific project
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: false,
    },
    taskId: { // Optional: Track utilization against a specific task
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
        required: false,
    },
    date: {
        type: Date,
        required: true,
    },
    hours: { // For labor/equipment utilization
        type: Number,
        required: function() { return this.resourceType === "Labor" || this.resourceType === "Equipment"; },
    },
    quantity: { // For material utilization
        type: Number,
        required: function() { return this.resourceType === "Material"; },
    },
    notes: {
        type: String,
        trim: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    // Add resourceType to simplify queries/validation, populated pre-save
    resourceType: {
        type: String,
        required: true,
        enum: ["Labor", "Equipment", "Material"],
    },
}, {
    timestamps: true,
});

// Indexes
resourceUtilizationSchema.index({ resourceId: 1, date: -1 });
resourceUtilizationSchema.index({ projectId: 1, date: -1 });
resourceUtilizationSchema.index({ taskId: 1, date: -1 });

// Pre-save hook to fetch and store the resource type
resourceUtilizationSchema.pre("save", async function(next) {
    if (this.isNew || this.isModified("resourceId")) {
        try {
            const resource = await mongoose.model("Resource").findById(this.resourceId).select("type");
            if (resource) {
                this.resourceType = resource.type;
            } else {
                next(new Error("Resource not found for utilization record."));
                return;
            }
        } catch (error) {
            next(error);
            return;
        }
    }
    next();
});

const ResourceUtilization = mongoose.model("ResourceUtilization", resourceUtilizationSchema);

module.exports = ResourceUtilization;

