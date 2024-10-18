import React, {useEffect, useState} from "react"
import LandingPage from "./pages/LandingPage"

const App = () => {

  useEffect(() => { 
    console.log("Hello") 
  }, [])


  return (
    <div className="app">
      <LandingPage />
    </div>
  );
}

export default App;
