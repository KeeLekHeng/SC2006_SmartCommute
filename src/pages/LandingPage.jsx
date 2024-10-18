import React from 'react'
import logo from '../assets/logo.png'

const LandingPage = () => {

    return (
        <div className="bg-cyan-200 flex flex-col justify-between h-screen">
            <header className="flex justify-center items-center pt-6">
                <img src={logo} alt="logo" className = "" />
            </header >

            <div className="flex justify-center items-center">
                <h1 className="text-5xl font-bold text-teal-700">SmartCommute</h1>
            </div>

            <main className="flex flex-col items-center w-full px-8">
                <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
                    <h2 className="text-3xl font-bold text-teal-700 mb-6 text-left">Key Features</h2>
                    <ul className="text-left space-y-4">
                        <li className="text-lg font-medium text-gray-700">
                            Real-Time Public Transport Data
                        </li>
                        <li className="text-lg font-medium text-gray-700">
                            Convenient Taxi Booking
                        </li>
                        <li className="text-lg font-medium text-gray-700">
                            Customized Commuting Recommendations
                        </li>
                        <li className="text-lg font-medium text-gray-700">
                            Economical Route Planning
                        </li>
                    </ul>
                </div>
            </main>

            <footer className="flex justify-center pb-8">
                <button className="bg-teal-500 text-white py-3 px-8 rounded-lg font-bold text-lg transition hover:bg-teal-600 focus:outline-none focus:ring-4 focus:ring-teal-300"> Get Started </button>
            </footer>


        </div>
    )
}

export default LandingPage