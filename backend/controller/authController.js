const User = require('../models/userModel');
const bcrypt = require('bcrypt');

// Register a new user
const registerUser = async (req, res) => {
    const { username, email, password, fruits, gender } = req.body;

    const lowerCaseUsername = username.toLowerCase();
    const lowerCaseEmail = email.toLowerCase();
    const lowerCaseFruits = fruits.toLowerCase(); // Assuming fruits is a single string

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email: lowerCaseEmail });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Create a new user
        const user = await User.create({ username: lowerCaseUsername, email: lowerCaseEmail, password, fruits: lowerCaseFruits, gender });

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Log in an existing user
const loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        console.log(`Login attempt for username: ${username}`);
        
        const user = await User.findOne({ username: username.toLowerCase() }); // Ensure case-insensitive search

        console.log('Found user:', user); // This will log null if user is not found

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const isMatch = await user.comparePassword(password);
        console.log('Password match:', isMatch); // Log the result of password comparison

        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        res.status(200).json({ 
            message: 'Logged in successfully', 
            user: { 
                username: user.username,
                email: user.email,
                fruits: user.fruits
            }
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Change user password
const changeUserPassword = async (req, res) => {
    const { userId } = req.params; // Assuming you're passing the user ID in the route
    const { newPassword, currentPassword, fruits, email } = req.body;

    try {
        // Normalize input fields to lowercase
        const lowerCaseEmail = email.toLowerCase();
        const lowerCaseFruits = fruits.toLowerCase(); // Assuming fruits is a single string

        const user = await User.findById(userId); // Correcting this line to use userId
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Retrieve and send email and favorite fruit
        const userDetails = {
            email: user.email,
            fruits: user.fruits,
        };

        // Hash and set the new password
        user.password = await bcrypt.hash(newPassword, 10);
        // Update the user's email and fruits fields if provided
        if (lowerCaseEmail) {
            user.email = lowerCaseEmail;
        }
        if (lowerCaseFruits) {
            user.fruits = lowerCaseFruits;
        }
        await user.save();

        res.status(200).json({ message: "Password updated successfully", user: userDetails });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
    changeUserPassword,
};
