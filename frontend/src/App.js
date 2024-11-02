import React, {useState} from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MainApp from "./MainApp"; 
import GpsPermission from "./pages/GpsPermission";
import {GpsProvider} from './context/GpsContext';
import { UserProvider } from "./context/UserContext";
import SearchPage from './pages/SearchPage'
import ReviewPage from './pages/ReviewPage';
import DisplayInfoPage from './pages/DisplayInfoPage'
import SettingsPage from './pages/SettingsPage'
import SearchHistoryPage from './pages/SearchHistoryPage'
import UpdatePassword from './pages/UpdatePassword';
import ForgetPassword from './pages/ForgetPassword';
import Comparisons from "./pages/Comparisons";

const App = () => {

  return (
    <UserProvider>
    <GpsProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/main" element={<MainApp />} />
        <Route path='/gps' element ={<GpsPermission />} />
        <Route path='/search' element ={<SearchPage />} />
        <Route path='/review' element={<ReviewPage />} />
        <Route path='/settings' element={<SettingsPage />} />
        <Route path='/searchHistory' element={<SearchHistoryPage />} />
        <Route path='/display' element={<DisplayInfoPage/>} />
        <Route path='/update-password' element={<UpdatePassword/>} />
        <Route path='/comparisons' element={<Comparisons/>} />
        <Route path='/forget-password' element={<ForgetPassword/>} />
      </Routes>
  </GpsProvider>
  </UserProvider>
    
  );
};

export default App;
