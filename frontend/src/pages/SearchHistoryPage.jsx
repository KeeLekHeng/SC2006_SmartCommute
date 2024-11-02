import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../context/UserContext';

const SearchHistoryPage = () => {
  const { user: username } = useContext(UserContext);
  const [searchHistory, setSearchHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 5;

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = searchHistory.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(searchHistory.length / entriesPerPage);

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

  return (
    <div className="bg-teal-500 flex justify-center items-center h-screen p-4">
      <div className="bg-white p-6 rounded-lg w-full max-w-4xl shadow-lg overflow-y-auto">
        <h1 className="font-bold text-center mb-6 text-lg text-gray-700">Search History</h1>

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
                <th className="py-3 px-4 border-b text-left font-semibold">Mode of Transport</th>
                <th className="py-3 px-4 border-b text-left font-semibold">Duration</th>
                <th className="py-3 px-4 border-b text-left font-semibold">Cost</th>
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
                  <td className="py-3 px-4 border-b">{entry.mode_of_transport}</td>
                  <td className="py-3 px-4 border-b">{entry.duration}</td>
                  <td className="py-3 px-4 border-b">{entry.cost}</td>
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
            disabled={currentPage === totalPages || totalPages === 0}
            className={`p-2 ${currentPage === totalPages || totalPages === 0 ? "bg-gray-300" : "bg-blue-500 text-white"} rounded`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchHistoryPage;