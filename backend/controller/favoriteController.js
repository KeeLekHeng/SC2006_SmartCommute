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

const addFavorite = async (req, res) => {
  console.log("POST /favorites request received with data:", req.body); // Log to confirm request
  const { username, name, location } = req.body;
  
  // Log incoming data for debugging
  console.log("addFavorite request body:", req.body);

  try {
    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      console.log("User not found:", username);
      return res.status(404).json({ message: 'User not found' });
    }

    // Log user information to confirm correct user data
    console.log("User found:", user);

    // Create a new favorite with user's ObjectId as userId
    const favorite = new Favorite({
      userId: user._id,
      name,
      location,
    });

    const newFavorite = await favorite.save();
    console.log("Favorite added successfully:", newFavorite);

    res.status(201).json(newFavorite);
  } catch (error) {
    console.error("Error in addFavorite:", error.message);
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