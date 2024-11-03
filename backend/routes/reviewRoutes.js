const express = require('express');
const { getReviews, addReview, updateUpvotes } = require('../controller/reviewController');
const router = express.Router();

router.get('/get', getReviews);
router.post('/add', addReview);
router.put('/upvote', updateUpvotes);

module.exports = router;
