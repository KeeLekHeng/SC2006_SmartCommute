import react , {useState} from "react";
import { FaMapMarkerAlt, FaHome, FaStar, FaCog, FaBars} from "react-icons/fa";
import logo from "../assets/logo.png"; 
import mapImage from "../assets/map.png"

const SearchPage = () => { 
    const [isDropdownOpen, setDropdownOpen] = useState(false); 

    const handleMenuToggle = () => {
        setDropdownOpen(!isDropdownOpen); 
    };

    return (
        <div className="flex items-center justify-center h-screen bg-cyan-200 overflow-hidden">
            {/*header*/}
            <header className="relative flex justify-between items-center p-4 shadow-md">
                <div className="flex items-center space-x-2">
                    <img src={logo} alt="SmartCommute logo" className="h-10 w-auto" />
                    <h1 className="text-x1 font-bold text-green-700">SmartCommute</h1>
                </div>
                <div className="flex items-center space-x-4">
                    <FaMapMarkerAlt className="text-xl text-gray-600" />
                    <div className="relative">
                        <FaBars
                            className="text-xl text-gray-600 cursor-pointer"
                            onClick={handleMenuToggle}
                        />
                        {isDropdownOpen && (
                           <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
                                <ul>
                                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Profile</li>
                                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Settings</li>
                                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Logout</li>
                                </ul>
                            </div>
                        )}
                </div>
          </div>
            </header>

            {/* Search Section*/}
            <div className="flex flex-col px-4 py-6">
                <h2 className="text-lg font-bold mb-2">User Location Input</h2>
                <div className="flex items-center space-x-2"> 
                    <input 
                        type="text"
                        placeholder="Enter Starting Location"
                        className="flex-grow border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:border-purple-500"
                    />
                    <button className="bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700">
                        Use Current Location
                    </button>
                </div>
            </div>

            {/* Map Select */}
            <div className="flex-grow px-4">
                <h2 className="text-lg font-bold mb-2">Select Locations</h2>
                <div className="w-full h-60 rounded-lg overflow-hidden shadow-lg">
                    <img src={mapImage} alt="Map" className="w-full h-full object-cover" />
                </div>
            </div>

            {/* Bottom Navigation */}
            <nav className="bg-white shadow-md fixed bottom-0 left-0 right-0 p-4 flex justify-around">
                <button className="flex flex-col items-center">
                    <FaHome className="text-xl text-gray-600" />
                    <span className="text-sm">Home</span>
                </button>
                <button className="flex flex-col items-center">
                    <FaStar className="text-xl text-gray-600" />
                    <span className="text-sm">Favourites</span>
                </button>
                <button className="flex flex-col items-center">
                    <FaCog className="text-xl text-gray-600" />
                    <span className="text-sm">Settings</span>
                </button>
            </nav>
        </div>

    );
};

export default SearchPage; 