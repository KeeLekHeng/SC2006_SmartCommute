// routes/favorites.js
const express = require('express');
const router = express.Router();
const Favorite = require('../models/favorites');

const {
  getFavorites,
  addFavorite,
  deleteFavorite,
} = require('../controller/favoriteController');

// Get all favorites for a user
router.get('/:username', getFavorites);

// Add a new favorite
router.post('/', addFavorite);

// Delete a favorite by ID
router.delete('/:id', deleteFavorite);

module.exports = router;