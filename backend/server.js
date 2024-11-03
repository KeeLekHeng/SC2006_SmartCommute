require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');                           //need cors to allow interaction between servers

// Import routes
const searchRoutes = require('./routes/search');
const userRoutes = require('./routes/authRoutes'); 
const reviewRoutes = require('./routes/reviewRoutes');



// Middleware
app.use(express.json());
app.use(cors());

// Logger middleware
app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
});

// Routes
app.use('/search', searchRoutes);
app.use('/authRoutes', userRoutes); 
app.use('/review',reviewRoutes);

const PORT = process.env.PORT || 5000; // Fallback to 5000 if PORT is not defined in .env
// Connect to DB
mongoose.connect(process.env.MONG_URI)
    .then(() => {
        app.listen(PORT, () => {
            console.log('connected to db & listening on port', PORT);
        });
    })
    .catch((error) => {
        console.log(error);
    });

