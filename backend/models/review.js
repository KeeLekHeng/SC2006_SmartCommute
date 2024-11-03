const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  review: {
    type: String,
    required: true,
  },
  upvotes: {
    type: Number,
    default: 0,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  username: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,   
  },
});

module.exports = mongoose.model('Review', reviewSchema);
