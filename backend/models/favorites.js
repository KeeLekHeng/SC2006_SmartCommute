const mongoose = require('mongoose');

// Define the schema for a favorite destination
const favoriteSchema = new mongoose.Schema({
  userId: {   
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to User model
    required: true,
  },
  name: {
    type: String,
    required: true,   // Name of the destination (e.g., "Home", "Work")
  },
  location: {
    type: String,
    required: true,   // Location details (e.g., address or coordinates)
  },
}, { timestamps: true }); // Adds createdAt and updatedAt fields

// Create the model from the schema
const Favorite = mongoose.model('Favorite', favoriteSchema);

module.exports = Favorite;
