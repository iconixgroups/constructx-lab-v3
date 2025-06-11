const mongoose = require("mongoose");
const Resource = require("./resource.model"); // Import the base schema

const equipmentResourceSchema = new mongoose.Schema({
    model: {
        type: String,
        trim: true,
    },
    serialNumber: {
        type: String,
        trim: true,
        unique: true, // Assuming serial numbers are unique
        sparse: true, // Allow multiple nulls if serial number is not always present
    },
    purchaseDate: {
        type: Date,
    },
    warrantyExpiration: {
        type: Date,
    },
    lastMaintenanceDate: {
        type: Date,
    },
    nextMaintenanceDate: {
        type: Date,
    },
    location: {
        type: String,
        trim: true,
    },
    condition: {
        type: String,
        enum: ["Excellent", "Good", "Fair", "Poor", "Needs Repair"],
        default: "Good",
    },
    ownedBy: {
        type: String,
        enum: ["Company", "Rental", "Leased"],
        default: "Company",
    },
});

// Create the discriminator model
const EquipmentResource = Resource.discriminator("Equipment", equipmentResourceSchema);

module.exports = EquipmentResource;

