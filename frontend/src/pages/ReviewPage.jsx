import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import boyAvatar from "../assets/boyAvatar.png";
import girlAvatar from "../assets/girlAvatar.png";
import settings from '../assets/setttings.png';
import favourites from '../assets/fav.png';
import home from '../assets/home.png';
import Logo from '../assets/logo1.png';

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
  const navigate = useNavigate();
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
    <div className="flex flex-col h-screen" style={{ backgroundColor: '#E8F0FA' }}>
      
      {/* Header */}
      <nav className="fixed h-24 top-0 left-0 right-0 bg-[#4169E1] text-white shadow-md z-40 transition-all duration-300">
        <div className="flex items-center justify-between h-full px-4">
          <div className="flex items-center">
            <img src={Logo} alt="Logo" className="w-18 h-14 mr-6" />
            <span className="text-2xl font-bold">SmartCommute</span>
          </div>

          <div className="flex space-x-44">
            <div className="flex flex-col items-center">
              <img src={home} alt="Home" className="w-14 h-14" />
              <Link to="/main" className="hover:underline text-lg font-semibold transition duration-300 pb-2 text-white">
                Home
              </Link>
            </div>
            <div className="flex flex-col items-center">
              <img src={favourites} alt="Favourites" className="w-12 h-12 mb-2" />
              <Link to="/favourites" className="hover:underline text-lg font-semibold transition duration-300 pb-2 text-white">
                Favourites
              </Link>
            </div>
            <div className="flex flex-col items-center">
              <img src={settings} alt="Settings" className="w-14 h-14" />
              <Link to="/settings" className="hover:underline text-lg font-semibold transition duration-300 pb-2 text-white">
                Settings
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Content Section */}
      <div className="pt-28 pb-24 flex-1 flex justify-center items-center px-4">
        <div className="bg-white p-5 rounded-lg w-full max-w-3xl shadow-lg overflow-y-auto relative h-[70vh]"> {/* Reduced height */}
          
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-full shadow hover:bg-gray-300 transition duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>

          <h1 className="font-bold text-center mb-4 text-lg text-gray-700">Leave a Review</h1>
          <div className="mb-4">
            <textarea
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
              placeholder="Write your review here..."
              rows="4"
              className="w-full p-2 border border-gray-300 rounded mb-2"
            />
            <button onClick={handleSubmitReview} className="p-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded w-full hover:from-blue-600 hover:to-blue-800 transition duration-300 shadow-md">
              Submit Review
            </button>
          </div>

          <div className="mb-4 flex justify-around">
            <button onClick={() => setFilter('mostRecent')} className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300">
              Most Recent
            </button>
            <button onClick={() => setFilter('mostPopular')} className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300">
              Most Popular
            </button>
          </div>

          <div>
            <h2 className="font-bold mb-2 text-gray-700">Reviews</h2>
            {currentReviews.length > 0 ? (
              currentReviews.map((review) => (
                <Review key={`${review.username}-${review.review}`} review={review} onToggleUpvote={handleToggleUpvote} />
              ))
            ) : (
              <p className="text-center text-gray-500">No reviews yet. Be the first to leave one!</p>
            )}
          </div>

          <div className="mt-4 flex justify-between items-center">
            <button onClick={handlePreviousPage} disabled={currentPage === 1} className="p-2 bg-gray-300 rounded">
              Previous
            </button>
            <span className="text-gray-700">Page {currentPage} of {totalPages}</span>
            <button onClick={handleNextPage} disabled={currentPage === totalPages || totalPages === 0} className="p-2 bg-gray-300 rounded">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#4169E1] text-center text-lg text-white py-2 fixed bottom-0 w-full z-30">
        <Link to="/review" className="hover:underline mb-1 text-white">
          <i className="material-icons text-yellow-500 mr-4">star</i>
          Leave us a review 
          <i className="material-icons text-yellow-500 ml-4">star</i>
        </Link>
        <span className="block mt-2 text-white"> www.smartcommutesg.com</span>
      </footer>
    </div>
  );
};

export default ReviewPage;
