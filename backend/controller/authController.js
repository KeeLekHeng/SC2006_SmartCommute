const User = require('../models/userModel');
const bcrypt = require('bcrypt');


//check if user exist in database
const checkUserExists = async (req, res) => {
    const { username, email } = req.body;

    try {
        // Check if the user with the given username or email exists
        const user = await User.findOne({ $or: [{ username }, { email }] });
        
        if (user) {
            return res.status(409).json({ message: 'Username or email already exists' });
        } else {
            return res.status(200).json({ message: 'Username and email are available' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};
// Register a new user
const registerUser = async (req, res) => {
    const { username, email, password, gender, security } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Create a new user
        const user = await User.create({ username, email, password, gender, security, });
        await newUser.save(); 
       
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Log in an existing user
const loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if password is correct
        const isMatch = await user.comparePassword(password); // Make sure this method is correctly defined in your User model
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }


        res.status(200).json({ message: 'Logged in successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


// Change user password
const changeUserPassword = async (req, res) => {
    const { userId } = req.params; // Assuming you're passing the user ID in the route
    const { currentPassword, newPassword } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Verify current password
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(400).json({ error: "Current password is incorrect" });
        }

        // Hash and set the new password
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


//function to get user details by username
const getUserDetails = async (req, res) => {
    try {
      const user = await UserModel.findOne({ username: req.params.username });
      if (user) {
        res.json({ gender: user.gender });
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
};


module.exports = {
    registerUser,
    loginUser,
    changeUserPassword,
    checkUserExists,
};
