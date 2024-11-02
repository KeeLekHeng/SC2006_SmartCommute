const Favorite = require('../models/favorites');
const User = require('../models/userModel');

// Get all favorites for a user by username
const getFavorites = async (req, res) => {
  try {
    // Find user by username
    const user = await User.findOne({ username: req.params.username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find all favorites associated with the user's ObjectId
    const favorites = await Favorite.find({ userId: user._id });
    res.json(favorites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a new favorite for a user based on username
const addFavorite = async (req, res) => {
  const { username, name, location } = req.body;

  try {
    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create a new favorite using the user's _id as userId
    const favorite = new Favorite({
      userId: user._id,
      name,
      location,
    });

    const newFavorite = await favorite.save();
    res.status(201).json(newFavorite);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a favorite by ID
const deleteFavorite = async (req, res) => {
  try {
    const favorite = await Favorite.findByIdAndDelete(req.params.id);
    if (!favorite) {
      return res.status(404).json({ message: 'Favorite not found' });
    }
    res.json({ message: 'Favorite removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getFavorites,
  addFavorite,
  deleteFavorite,
};