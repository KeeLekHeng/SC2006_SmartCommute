const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const validator = require('validator');

// Register a new user
const registerUser = async (req, res) => {
    const { username, email, password, fruits, gender } = req.body;

    const lowerCaseEmail = email.toLowerCase();
    const lowerCaseFruits = fruits.toLowerCase();

    try {
        // Validate email format
        if (!validator.isEmail(lowerCaseEmail)) {
            return res.status(400).json({ error: 'Invalid Email: Please enter a valid email address.' });
        }

        // Check if email is already registered
        const emailExists = await User.findOne({ email: lowerCaseEmail });
        if (emailExists) {
            return res.status(400).json({ error: 'Email already in use: Please use a different email address.' });
        }

        // Check if username is already taken
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: 'Username already taken: Please choose a different username.' });
        }

        // Validate password requirements
        if (password.length < 8 || password.length > 18) {
            return res.status(400).json({ error: 'Invalid Password: Password must be between 8-18 characters long.' });
        }

        if (!/[A-Za-z]/.test(password)) {
            return res.status(400).json({ error: 'Invalid Password: Password must contain at least one letter.' });
        }

        if (!/\d/.test(password)) {
            return res.status(400).json({ error: 'Invalid Password: Password must contain at least one number.' });
        }

        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            return res.status(400).json({ error: 'Invalid Password: Password must contain at least one special character.' });
        }

        // Create the new user
        const user = await User.create({
            username,
            email: lowerCaseEmail,
            password,
            fruits: lowerCaseFruits,
            gender
        });

        // Return the created user as a response
        res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Server error: Unable to register user at this time.' });
    }
};



//     // try {
//     //     const existingUser = await User.findOne({ email });
//     //     if (existingUser) {
//     //         return res.status(400).json({ error: 'User already exists' });
//     //     }

//     //     const user = await User.create({ username, email, password, fruits, gender });
//         res.status(201).json({ message: 'User registered successfully' });
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// };



// Log in an existing user
const loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        console.log(`Login attempt for username: ${username}`);
        
        const user = await User.findOne({ username });
        console.log('Found user:', user);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const isMatch = await user.comparePassword(password);
        console.log('Password match:', isMatch);

        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Optional: If using JWT, generate a token here
        // const token = generateToken(user._id);

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
    const { username } = req.params;
    const { email, fruits, newPassword } = req.body;

    try {

        console.log('Received request to change password');
        console.log(`Username from params: ${username}`);
        console.log(`Email from body: ${email}`);
        console.log(`Fruits from body: ${fruits}`);
        console.log(`New password from body: ${newPassword}`);
        // Normalize and trim inputs
        const lowerCaseEmail = email.trim().toLowerCase();
        const lowerCaseFruits = fruits.trim().toLowerCase();
        console.log(`Normalized email: ${lowerCaseEmail}`);
        console.log(`Normalized fruits: ${lowerCaseFruits}`);

        console.log(`Finding user by username: ${username}`);
        console.log(`Finding user by username: ${username}`);
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        console.log(`Stored user email: ${user.email}`);
        console.log(`Stored user fruits: ${user.fruits}`);
        // Log stored user email for comparison

        // Check if input details are the same as in the database
        if (user.email.trim().toLowerCase() !== lowerCaseEmail) {
            return res.status(401).json({ error: 'Wrong email entered' });
        }
        if (user.fruits.trim().toLowerCase() !== lowerCaseFruits) {
            return res.status(401).json({ error: 'Wrong answer to the security question' });
        }

        // Update password without hashing
        user.password = newPassword;
        await user.save();

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error during password update:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const forgetPassword = async (req, res) => {
    const { email, fruits } = req.body;

    try {
        const lowerCaseEmail = email.toLowerCase();
        const lowerCaseFruits = fruits.toLowerCase();

        const user = await User.findOne({ email: lowerCaseEmail });

        if (!user) {
            return res.status(404).json({ error: 'Email not found' });
        }

        // Use the updated methods for comparison
        const isMatchEmail = user.compareEmail(lowerCaseEmail);
        if (!isMatchEmail) {
            return res.status(401).json({ error: 'Invalid Email' });
        }

        const isMatchFruit = user.compareFruits(lowerCaseFruits);
        if (!isMatchFruit) {
            return res.status(401).json({ error: 'Wrong answer to the security question' });
        }

        // Reset the password
        user.password = '12345678';
        console.log(user.password);
        await user.save();

        return res.status(200).json({ message: 'Password reset to default: 12345678. Remember to change it in settings' });
    } catch (error) {
        console.error('Error during password reset:', error);
        return res.status(500).json({ error: 'Server error. Please try again later.' });
    }
};

// Log out a user
const logoutUser = async (req, res) => {
    try {
        // For JWT-based systems, remove the token from the client
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const getUserDetails = async  (req, res) => { 
    const {username} = req.params; 
    try { 
        const user = await User.findOne({username}); 
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ gender: user.gender });
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}


module.exports = {
    registerUser,
    loginUser,
    changeUserPassword,
    forgetPassword,
    getUserDetails,
    logoutUser
};
