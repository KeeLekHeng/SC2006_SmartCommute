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
    <div className={styles.reviewContainer}>
      <div className={styles.reviewHeader}>
        <img src={avatar} alt="avatar" className={styles.avatar} />
        <p className={styles.reviewUsername}>{review.username}</p>
      </div>
      <p>{review.review}</p>
      <div className={styles.reviewFooter}>
        <small>{new Date(review.date).toLocaleString()}</small>
        <button
          onClick={() => onToggleUpvote(review)}
          className={`${styles.upvoteButton} ${review.hasUpvoted ? styles.upvoted : styles.notUpvoted}`}
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
    <div className={styles.container}>
      
      {/* Header */}
      <nav className={styles.header}>
        <div className={styles.headerContent}>
          <div className="flex items-center">
            <img src={Logo} alt="Logo" className={styles.logo} />
            <span className="text-2xl font-bold">SmartCommute</span>
          </div>

          <div className={styles.navLinks}>
            <div className={styles.navItem}>
              <img src={home} alt="Home" className={styles.navIcon} />
              <Link to="/main" className={styles.link}>Home</Link>
            </div>
            <div className={styles.navItem}>
              <img src={favourites} alt="Favourites" className={styles.navIconSmall} />
              <Link to="/favourites" className={styles.link}>Favourites</Link>
            </div>
            <div className={styles.navItem}>
              <img src={settings} alt="Settings" className={styles.navIcon} />
              <Link to="/settings" className={styles.link}>Settings</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Content Section */}
      <div className={styles.content}>
        <div className={styles.card}>
          
          {/* Back Button */}
          <button onClick={() => navigate(-1)} className={styles.backButton}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>

          <h1 className={styles.title}>Leave a Review</h1>
          <div className={styles.reviewInputContainer}>
            <textarea
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
              placeholder="Write your review here..."
              rows="4"
              className={styles.reviewTextarea}
            />
            <button onClick={handleSubmitReview} className={styles.submitButton}>
              Submit Review
            </button>
          </div>

          <div className={styles.filterButtons}>
            <button onClick={() => setFilter('mostRecent')} className={styles.filterButton}>
              Most Recent
            </button>
            <button onClick={() => setFilter('mostPopular')} className={styles.filterButton}>
              Most Popular
            </button>
          </div>

          <div>
            <h2 className={styles.reviewsTitle}>Reviews</h2>
            {currentReviews.length > 0 ? (
              currentReviews.map((review) => (
                <Review key={`${review.username}-${review.review}`} review={review} onToggleUpvote={handleToggleUpvote} />
              ))
            ) : (
              <p className={styles.noReviewsText}>No reviews yet. Be the first to leave one!</p>
            )}
          </div>

          <div className={styles.pagination}>
            <button onClick={handlePreviousPage} disabled={currentPage === 1} className={styles.pageButton}>
              Previous
            </button>
            <span className={styles.pageText}>Page {currentPage} of {totalPages}</span>
            <button onClick={handleNextPage} disabled={currentPage === totalPages || totalPages === 0} className={styles.pageButton}>
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className={styles.footer}>
        <Link to="/review" className={styles.footerLink}>
          <i className="material-icons text-yellow-500 mr-4">star</i>
          Leave us a review 
          <i className="material-icons text-yellow-500 ml-4">star</i>
        </Link>
        <span className={styles.footerText}> www.smartcommutesg.com</span>
      </footer>
    </div>
  );
};

const styles = {
  container: "flex flex-col h-screen bg-[#E8F0FA]",
  header: "fixed h-24 top-0 left-0 right-0 bg-[#4169E1] text-white shadow-md z-40 transition-all duration-300",
  headerContent: "flex items-center justify-between h-full px-4",
  logo: "w-18 h-14 mr-6",
  navLinks: "flex space-x-44",
  navItem: "flex flex-col items-center",
  link: "hover:underline text-lg font-semibold transition duration-300 pb-2 text-white",
  navIcon: "w-14 h-14",
  navIconSmall: "w-12 h-12 mb-2",
  content: "pt-28 pb-24 flex-1 flex justify-center items-center px-4",
  card: "bg-white p-5 rounded-lg w-full max-w-3xl shadow-lg overflow-y-auto relative h-[70vh]",
  backButton: "absolute top-4 left-4 flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-full shadow hover:bg-gray-300 transition duration-200",
  title: "font-bold text-center mb-4 text-lg text-gray-700",
  reviewInputContainer: "mb-4",
  reviewTextarea: "w-full p-2 border border-gray-300 rounded mb-2",
  submitButton: "p-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded w-full hover:from-blue-600 hover:to-blue-800 transition duration-300 shadow-md",
  filterButtons: "mb-4 flex justify-around",
  filterButton: "p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300",
  reviewsTitle: "font-bold mb-2 text-gray-700",
  noReviewsText: "text-center text-gray-500",
  pagination: "mt-4 flex justify-between items-center",
  pageButton: "p-2 bg-gray-300 rounded",
  pageText: "text-gray-700",
  footer: "bg-[#4169E1] text-center text-lg text-white py-2 fixed bottom-0 w-full z-30",
  footerLink: "hover:underline mb-1 text-white",
  footerText: "block mt-2 text-white",
  reviewContainer: "bg-gray-100 p-4 border border-gray-300 rounded mb-4 text-left relative",
  reviewHeader: "flex items-center mb-2",
  avatar: "w-10 h-10 rounded-full mr-2",
  reviewUsername: "font-bold",
  reviewFooter: "flex justify-between items-center mt-2",
  upvoteButton: "p-2 rounded absolute right-2 top-1/2 transform -translate-y-1/2",
  upvoted: "bg-green-500 text-white",
  notUpvoted: "bg-gray-100 text-black",
};

export default ReviewPage;
