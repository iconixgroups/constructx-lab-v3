const mongoose = require("mongoose");
const Resource = require("./resource.model"); // Import the base schema

const materialResourceSchema = new mongoose.Schema({
    unit: {
        type: String,
        required: true,
        trim: true,
        // Example units: kg, m, m², m³, L, piece, box, pallet
    },
    quantity: {
        type: Number,
        required: true,
        default: 0,
    },
    reorderPoint: {
        type: Number,
    },
    supplier: {
        type: String,
        trim: true,
    },
    location: {
        type: String,
        trim: true,
    },
    expirationDate: {
        type: Date,
    },
});

// Create the discriminator model
const MaterialResource = Resource.discriminator("Material", materialResourceSchema);

module.exports = MaterialResource;

