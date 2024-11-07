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
          <button 
            onClick={() => navigate('/settings')}
            className={styles.backButton}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>

          <h1 className={styles.title}>Search History</h1>
          
          {/* Clear History Button */}
          <div className="mb-4 text-right">
            <button 
              onClick={handleClearHistory}
              className={styles.clearButton}
            >
              Clear History
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr style={styles.tableHeader}>
                  <th className={styles.tableHead}>Date</th>
                  <th className={styles.tableHead}>Starting Location</th>
                  <th className={styles.tableHead}>Destination</th>
                </tr>
              </thead>
              <tbody>
                {currentEntries.length > 0 ? currentEntries.map((entry, index) => (
                  <tr key={index} className={styles.tableRow}>
                    <td className={styles.tableCell}>
                      {entry.timestamp 
                        ? new Date(entry.timestamp).toLocaleString('en-SG', { timeZone: 'Asia/Singapore' })
                        : 'N/A'}
                    </td>
                    <td className={styles.tableCell}>{entry.start_location}</td>
                    <td className={styles.tableCell}>{entry.destination}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="6" className={styles.noData}>No search history found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className={styles.pagination}>
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className={`${styles.pageButton} ${currentPage === 1 ? styles.disabledButton : styles.activeButton}`}
            >
              Previous
            </button>
            <span className={styles.pageText}>Page {currentPage} of {totalPages}</span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages || totalPages === 1}
              className={`${styles.pageButton} ${currentPage === totalPages || totalPages === 1 ? styles.disabledButton : styles.activeButton}`}
            >
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
        <span className={styles.footerText}>www.smartcommutesg.com</span>
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
  content: "pt-28 flex-1 flex justify-center items-center px-4 pb-8",
  card: "bg-white p-6 rounded-lg w-full max-w-4xl shadow-lg overflow-y-auto relative",
  backButton: "absolute top-4 left-4 flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-full font-semibold hover:bg-gray-300 shadow transition duration-200",
  title: "font-bold text-center mb-6 text-lg text-gray-700",
  clearButton: "bg-red-500 text-white p-2 rounded hover:bg-red-600 transition duration-300",
  tableHeader: {
    background: 'linear-gradient(to right, #3b82f6, #2563eb, #1d4ed8)',
    color: 'white',
  },
  tableHead: "py-3 px-4 border-b text-left font-semibold",
  tableRow: "hover:bg-gray-100 transition duration-150",
  tableCell: "py-3 px-4 border-b",
  noData: "py-3 px-4 border-b text-center text-gray-500",
  pagination: "flex justify-between items-center mt-4",
  pageButton: "p-2 rounded",
  disabledButton: "bg-gray-300",
  activeButton: "bg-blue-500 text-white",
  pageText: "text-gray-700",
  footer: "bg-[#4169E1] text-center text-lg text-white py-2 fixed bottom-0 w-full z-30",
  footerLink: "hover:underline mb-1 text-white",
  footerText: "block mt-2 text-white",
};

export default SearchHistoryPage;
