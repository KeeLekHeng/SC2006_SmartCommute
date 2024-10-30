import React, { useState } from 'react';

const mockSearchHistory = [
  { date: '2024-10-31', start: '1 Marina Boulevard, Singapore 018989', destination: '2 Orchard Turn, ION Orchard, Singapore 238801', mode: 'MRT', duration: '25 minutes', cost: '$1.80' },
  { date: '2024-10-29', start: '10 Bayfront Avenue, Marina Bay Sands, Singapore 018956', destination: '80 Mandai Lake Rd, Singapore Zoo, Singapore 729826', mode: 'Bus', duration: '1 hour', cost: '$2.50' },
  { date: '2024-10-27', start: '36 Robinson Road, Singapore 068877', destination: '18 Marina Gardens Dr, Gardens by the Bay, Singapore 018953', mode: 'Taxi', duration: '15 minutes', cost: '$15.00' },
  { date: '2024-10-25', start: '21 Choa Chu Kang Ave 4, Lot One, Singapore 689812', destination: '30 Boon Lay Way, Jurong Point, Singapore 609957', mode: 'MRT', duration: '30 minutes', cost: '$2.00' },
  { date: '2024-10-23', start: '100 Tras St, Singapore 079027', destination: '1 Kim Seng Promenade, Great World City, Singapore 237994', mode: 'Bus', duration: '45 minutes', cost: '$1.60' },
  { date: '2024-10-21', start: '22 Sin Ming Ln, Midview City, Singapore 573969', destination: '33 Sengkang West Ave, Singapore 797653', mode: 'Car', duration: '20 minutes', cost: '$10.00' },
  { date: '2024-10-20', start: '2 Jurong East St 21, IMM Building, Singapore 609601', destination: '302 Tiong Bahru Rd, Singapore 168732', mode: 'MRT', duration: '40 minutes', cost: '$2.30' },
  { date: '2024-10-18', start: '3 Changi Business Park Central 1, Singapore 486037', destination: '78 Airport Blvd, Singapore 819666', mode: 'Bus', duration: '30 minutes', cost: '$1.70' },
  { date: '2024-10-17', start: '138 Robinson Road, Singapore 068906', destination: '60 Anson Road, Mapletree Anson, Singapore 079914', mode: 'Walk', duration: '10 minutes', cost: 'Free' },
];
// this is just sample data. must retrieve the user data from BACKEND here

const SearchHistoryPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 5;

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = mockSearchHistory.slice(indexOfFirstEntry, indexOfLastEntry);

  const totalPages = Math.ceil(mockSearchHistory.length / entriesPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

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
              {currentEntries.map((entry, index) => (
                <tr key={index} className="hover:bg-gray-100 transition duration-150">
                  <td className="py-3 px-4 border-b">{entry.date}</td>
                  <td className="py-3 px-4 border-b">{entry.start}</td>
                  <td className="py-3 px-4 border-b">{entry.destination}</td>
                  <td className="py-3 px-4 border-b">{entry.mode}</td>
                  <td className="py-3 px-4 border-b">{entry.duration}</td>
                  <td className="py-3 px-4 border-b">{entry.cost}</td>
                </tr>
              ))}
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
            disabled={currentPage === totalPages}
            className={`p-2 ${currentPage === totalPages ? "bg-gray-300" : "bg-blue-500 text-white"} rounded`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};


export default SearchHistoryPage;