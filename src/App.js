import React, { useState } from "react";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage"
import MainApp from "./MainApp"; // Placeholder for the main app after login

const App = () => {
  const [currentPage, setCurrentPage] = useState("landing"); // Tracks the current page

  const handleGoLogin = () => {
    setCurrentPage("login");
  };

  const handleLogin = () => {
    setCurrentPage("main");
  };

  const handleGoToRegister = () => {
    setCurrentPage("register"); 
  };

  return (
    <div>
      {currentPage === "landing" && <LandingPage onGetStarted={handleGoLogin} />}
      {currentPage === "login" && <LoginPage onLogin={handleLogin} onGoToRegister={handleGoToRegister} />}
      {currentPage === "register" && <RegisterPage onGoToLogin={handleGoLogin} onLogin={handleGoLogin} onRegister={handleGoLogin} />}
      {currentPage === "main" && <MainApp />}
    </div>
  );
};

export default App;
