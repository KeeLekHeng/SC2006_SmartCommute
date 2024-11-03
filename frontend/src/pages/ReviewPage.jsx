import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import boyAvatar from "../assets/boyAvatar.png";
import girlAvatar from "../assets/girlAvatar.png";

const avatars = {
  male: boyAvatar,
  female: girlAvatar,
};

const Review = ({ review, onToggleUpvote }) => {
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
          onClick={() => onToggleUpvote(review)}
          className={`p-2 rounded ${review.hasUpvoted ? "bg-green-500 text-white" : "bg-gray-100 text-black"} absolute right-2 top-1/2 transform -translate-y-1/2`}
        >
          Upvote ({review.upvotes})
        </button>
      </div>
    </div>
  );
};

const ReviewPage = () => {
  const navigate = useNavigate(); // Initialize navigate function
  const { user: username, gender } = useContext(UserContext);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState('');
  const [filter, setFilter] = useState('mostRecent');
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 5;

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get('http://localhost:4000/review/get');
        const updatedReviews = response.data.map(review => ({
          ...review,
          hasUpvoted: false,
        }));
        setReviews(updatedReviews);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };
    fetchReviews();
  }, []);

  const handleSubmitReview = async () => {
    if (newReview.trim() && username && gender) {
      try {
        const response = await axios.post('http://localhost:4000/review/add', {
          review: newReview,
          username: username,
          gender: gender,
        });
        setReviews([...reviews, { ...response.data, hasUpvoted: false }]);
        setNewReview('');
      } catch (error) {
        console.error('Error submitting review:', error);
      }
    } else {
      console.error('User data is not available or review is empty.');
    }
  };

  const handleToggleUpvote = async (review) => {
    try {
      const action = review.hasUpvoted ? 'decrement' : 'increment';
      const response = await axios.put(`http://localhost:4000/review/upvote`, {
        action,
        username: review.username,
        review: review.review,
      });

      const updatedReview = response.data;

      setReviews(reviews.map(r => 
        (r.username === review.username && r.review === review.review
          ? { ...updatedReview, hasUpvoted: !review.hasUpvoted }
          : r)
      ));
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
      <div className="bg-white p-5 rounded-lg w-full max-w-lg h-full max-h-[90vh] shadow-lg overflow-y-auto relative">
        
        {/* Styled Back Button with SVG Arrow */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-full shadow hover:bg-gray-300 transition duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-2" // Adjust size here
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          
        </button>

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
              <Review key={`${review.username}-${review.review}`} review={review} onToggleUpvote={handleToggleUpvote} />
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
