const mongoose = require("mongoose");
const Resource = require("./resource.model"); // Import the base schema

const laborResourceSchema = new mongoose.Schema({
    userId: { // Optional link to a specific user in the system
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false,
    },
    role: {
        type: String,
        required: true,
        trim: true,
    },
    skills: [{
        type: String,
        trim: true,
    }],
    certifications: [{
        type: String,
        trim: true,
    }],
    availability: { // Example: { monday: ["08:00-12:00", "13:00-17:00"], tuesday: [...], ... }
        type: mongoose.Schema.Types.Mixed,
        default: {},
    },
    maxHoursPerDay: {
        type: Number,
        default: 8,
    },
    maxHoursPerWeek: {
        type: Number,
        default: 40,
    },
});

// Create the discriminator model
const LaborResource = Resource.discriminator("Labor", laborResourceSchema);

module.exports = LaborResource;

