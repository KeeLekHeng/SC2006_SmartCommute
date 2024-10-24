import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MainApp from "./MainApp"; 
import GpsPermission from "./pages/GpsPermission";
import SearchPage from "./pages/SearchPage";
import ComparisonPage from "./pages/ComparisonPage";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/main" element={<MainApp />} />
      <Route path="/GPS" element={<GpsPermission />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/comparison" element={<ComparisonPage />} />
    </Routes>
  );
};

export default App;
