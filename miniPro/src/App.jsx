import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import NavbarHome from "./Navbar/NavbarHome";
import HomePage from "./HomePage/HomePage";
import ProblemPage from "./ProblemPage/ProblemPage";
import Aptitude from "./Apptitude/Apptitude";
import Auth from "./login/Auth";
import { auth } from "./login/FirebaseConfig"; // Firebase authentication
import Challenge from "./challenge/Challenge"; // Ensure the correct path

function App() {
  const [user, setUser] = useState(null);

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe(); // Cleanup listener
  }, []);

  return (
    <Router>
      <div className="app-container">
        {!user ? (
          <Auth />
        ) : (
          <>
            {/* Navbar always visible */}
            <NavbarHome />

            {/* Instead of separate navigation, we show both components on the same page */}
            <div id="homeP">
              <HomePage />
            </div>
            <div id="problems">
              <ProblemPage />
            </div>
            <div id="challenges">
            <Challenge />
          </div>
          <div id="aptitude">
              <Aptitude />
            </div>
            {/* Handle unmatched routes */}
            <Routes>
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </>
        )}
      </div>
    </Router>
  );
}

export default App;
