import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import settings from '../assets/setttings.png';
import favourites from '../assets/fav.png';
import home from '../assets/home.png';
import Logo from '../assets/logo1.png';

const SearchHistoryPage = () => {
  const { user: username } = useContext(UserContext);
  const navigate = useNavigate();
  const [searchHistory, setSearchHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 5;

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = searchHistory.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = searchHistory.length < 5 ? 1 : Math.ceil(searchHistory.length / entriesPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  useEffect(() => {
    const fetchSearchHistory = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/search/history/${username}`);
        if (response.status === 200) {
          setSearchHistory(response.data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))); // Sort by most recent
        }
      } catch (error) {
        console.error('Error fetching search history:', error);
      }
    };

    if (username) {
      fetchSearchHistory();
    }
  }, [username]);

  const handleClearHistory = async () => {
    try {
      const response = await axios.delete(`http://localhost:4000/search/clearhistory/${username}`);
      if (response.status === 200) {
        setSearchHistory([]);
      }
    } catch (error) {
      console.error('Error clearing search history', error);
    }
  };

  return (
    <div className="flex flex-col h-screen" style={{ backgroundColor: '#E8F0FA' }}> {/* Light Blue Gray Background */}
      
      {/* Header */}
      <nav className="fixed h-24 top-0 left-0 right-0 bg-[#4169E1] text-white shadow-md z-40 transition-all duration-300"> {/* Royal Blue Header */}
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
      <div className="pt-28 flex-1 flex justify-center items-center px-4 pb-8">
        <div className="bg-white p-6 rounded-lg w-full max-w-4xl shadow-lg overflow-y-auto relative">
          
          {/* Back Button */}
          <button 
            onClick={() => navigate('/settings')}
            className="absolute top-4 left-4 flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-full font-semibold hover:bg-gray-300 shadow transition duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>

          <h1 className="font-bold text-center mb-6 text-lg text-gray-700">Search History</h1>
          
          {/* Clear History Button */}
          <div className="mb-4 text-right">
            <button 
              onClick={handleClearHistory}
              className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition duration-300"
            >
              Clear History
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr style={{
                  background: 'linear-gradient(to right, #3b82f6, #2563eb, #1d4ed8)',
                  color: 'white'
                }}>
                  <th className="py-3 px-4 border-b text-left font-semibold">Date</th>
                  <th className="py-3 px-4 border-b text-left font-semibold">Starting Location</th>
                  <th className="py-3 px-4 border-b text-left font-semibold">Destination</th>
                </tr>
              </thead>
              <tbody>
                {currentEntries.length > 0 ? currentEntries.map((entry, index) => (
                  <tr key={index} className="hover:bg-gray-100 transition duration-150">
                    <td className="py-3 px-4 border-b">
                      {entry.timestamp 
                        ? new Date(entry.timestamp).toLocaleString('en-SG', { timeZone: 'Asia/Singapore' })
                        : 'N/A'}
                    </td>
                    <td className="py-3 px-4 border-b">{entry.start_location}</td>
                    <td className="py-3 px-4 border-b">{entry.destination}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="6" className="py-3 px-4 border-b text-center text-gray-500">No search history found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className={`p-2 ${currentPage === 1 ? "bg-gray-300" : "bg-blue-500 text-white"} rounded`}
            >
              Previous
            </button>
            <span className="text-gray-700">Page {currentPage} of {totalPages}</span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages || totalPages === 1}
              className={`p-2 ${currentPage === totalPages || totalPages === 1 ? "bg-gray-300" : "bg-blue-500 text-white"} rounded`}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#4169E1] text-center text-lg text-white py-2 fixed bottom-0 w-full z-30"> {/* Royal Blue Footer */}
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

export default SearchHistoryPage;
