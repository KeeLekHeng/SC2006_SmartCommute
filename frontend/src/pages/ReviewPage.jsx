import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import boyAvatar from "../assets/boyAvatar.png";
import girlAvatar from "../assets/girlAvatar.png";

const avatars = {
  male: boyAvatar,
  female: girlAvatar,
};

const Review = ({ review, onToggleUpvote }) => {
  // Determine the avatar based on the gender from the review
  const avatar = review.gender === 'female' ? avatars.female : avatars.male;

  return (
    <div className="bg-gray-100 p-4 border border-gray-300 rounded mb-4 text-left relative">
      <div className="flex items-center mb-2">
        <img src={avatar} alt="avatar" className="w-10 h-10 rounded-full mr-2" />
        <p className="font-bold">{review.username}</p>
      </div>
      <p>{review.review}</p>
      <div className="flex justify-between items-center mt-2">
        <small>{new Date(review.date).toLocaleString()}</small>
        <button
          onClick={() => onToggleUpvote(review.username)}
          className={`p-2 rounded ${review.hasUpvoted ? "bg-green-500 text-white" : "bg-gray-100 text-black"} absolute right-2 top-1/2 transform -translate-y-1/2`}
        >
          Upvote ({review.upvotes})
        </button>
      </div>
    </div>
  );
};

const ReviewPage = () => {
  const { user } = useContext(UserContext); // Assuming UserContext holds user data
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState('');
  const [filter, setFilter] = useState('mostRecent');
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 5;

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get('http://localhost:4000/review/get');
        setReviews(response.data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };
    fetchReviews();
  }, []);

  const handleSubmitReview = async () => {
    if (newReview.trim()) {
      try {
        const response = await axios.post('http://localhost:4000/review/add', {
          review: newReview,
          username: user.username,
          gender: user.gender,
        });
        setReviews([...reviews, response.data]);
        setNewReview('');
      } catch (error) {
        console.error('Error submitting review:', error);
      }
    }
  };

  const handleToggleUpvote = async (username) => {
    try {
      const response = await axios.put(`http://localhost:4000/review/${username}/upvote`);
      const updatedReview = response.data;
      setReviews(reviews.map(review => (review.username === username ? updatedReview : review)));
    } catch (error) {
      console.error('Error toggling upvote:', error);
    }
  };

  const sortedReviews = [...reviews].sort((a, b) => {
    if (filter === 'mostPopular') {
      return b.upvotes - a.upvotes;
    }
    return new Date(b.date) - new Date(a.date);
  });

  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = sortedReviews.slice(indexOfFirstReview, indexOfLastReview);
  const totalPages = Math.ceil(sortedReviews.length / reviewsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="bg-teal-500 flex justify-center items-center h-screen">
      <div className="bg-white p-5 rounded-lg w-full max-w-lg h-full max-h-[90vh] shadow-lg overflow-y-auto">
        <h1 className="font-bold text-center mb-4">Leave a Review</h1>
        <div className="mb-4">
          <textarea
            value={newReview}
            onChange={(e) => setNewReview(e.target.value)}
            placeholder="Write your review here..."
            rows="4"
            className="w-full p-2 border border-gray-300 rounded mb-2"
          />
          <button onClick={handleSubmitReview} className="p-2 bg-green-500 text-white rounded w-full">
            Submit Review
          </button>
        </div>

        <div className="mb-4 flex justify-around">
          <button onClick={() => setFilter('mostRecent')} className="p-2 bg-blue-500 text-white rounded">
            Most Recent
          </button>
          <button onClick={() => setFilter('mostPopular')} className="p-2 bg-blue-500 text-white rounded">
            Most Popular
          </button>
        </div>

        <div>
          <h2 className="font-bold">Reviews</h2>
          {currentReviews.length > 0 ? (
            currentReviews.map((review) => (
              <Review key={review._id} review={review} onToggleUpvote={handleToggleUpvote} />
            ))
          ) : (
            <p>No reviews yet. Be the first to leave one!</p>
          )}
        </div>

        <div className="mt-4 flex justify-between items-center">
          <button onClick={handlePreviousPage} disabled={currentPage === 1} className="p-2 bg-gray-300 rounded">
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button onClick={handleNextPage} disabled={currentPage === totalPages || totalPages === 0} className="p-2 bg-gray-300 rounded">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewPage;
