import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MainApp from "./MainApp"; 
import GpsPermission from "./pages/GpsPermission";
import { GpsProvider } from './context/GpsContext'; 
import SearchPage from './pages/SearchPage';
import ReviewPage from './pages/ReviewPage';
import ForgetPassword from './pages/ForgetPassword'; // Import ForgetPasswordPage

const App = () => {
  return (
    <GpsProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/main" element={<MainApp />} />
        <Route path="/gps" element={<GpsPermission />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/review" element={<ReviewPage />} />
        <Route path="/forget-password" element={<ForgetPassword />} /> 
      </Routes>
    </GpsProvider>
  );
};

export default App;