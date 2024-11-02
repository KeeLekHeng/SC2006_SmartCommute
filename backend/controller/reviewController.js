const Review = require('../models/review');

// Add a new review
exports.addReview = async (req, res) => {
  const { username, gender, review } = req.body;

  try {
    const newReview = new Review({
      username,
      gender,
      review,
      upvotes: 0, // Initialize with 0 upvotes
    });

    await newReview.save();
    res.status(201).json(newReview);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add review', details: error.message });
  }
};

// Get all reviews
exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ date: -1 }); // Sort by date, most recent first
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reviews', details: error.message });
  }
};

// Update upvotes by username
exports.updateUpvotes = async (req, res) => {
  const { username, review } = req.body; // Expecting `username` and `review` in the request body
  const { action } = req.body; // `action` should be 'increment' or 'decrement'

  if (!action || (action !== 'increment' && action !== 'decrement')) {
    return res.status(400).json({ message: 'Invalid action. Use "increment" or "decrement"' });
  }

  try {
    // Find the review using both username and review content
    const reviewToUpdate = await Review.findOne({ username, review: review.trim() });
    if (!reviewToUpdate) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Update the upvote count based on the action
    if (action === 'increment') {
      reviewToUpdate.upvotes += 1;
    } else if (action === 'decrement' && reviewToUpdate.upvotes > 0) {
      reviewToUpdate.upvotes -= 1;
    }

    await reviewToUpdate.save();
    res.status(200).json(reviewToUpdate);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update upvotes', details: error.message });
  }
};
