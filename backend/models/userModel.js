const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please provide a username'],
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
        trim: true,
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: [6, 'Password must be at least 6 characters'],
    },
    fruits: {
        type: String,
        required: [true, 'What is your favourite fruit?'],
    },
    gender: {
        type: String,
        required: [true, 'Please provide your gender'],
        enum: ['male', 'female'], // Restrict values to 'male' or 'female'
    }
}, { timestamps: true });

// Hash password before saving user
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Password comparison method
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;