import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../login/FirebaseConfig";
import { signOut } from "firebase/auth";
import "./NavbarH.css";

const Navbarhome = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Logout Error:", error.message);
    }
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <h1 id="tit">Placement Tracker </h1>
          </div>

          {/* Updated navbar links to scroll to sections */}
          <nav className="nav-links">
            <ul>
              <li>
                <a href="#homeP" className="active" onClick={closeMenu}>
                  Home
                </a>
              </li>
              <li>
                <a href="#problems" onClick={closeMenu}>
                  Problems
                </a>
              </li>
              <li>
                <a href="#challenges" onClick={closeMenu}>
                  Challenge
                </a>
              </li>
            </ul>
          </nav>

          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>

          <button className="menu-btn" onClick={toggleMenu}>
            ☰
          </button>
        </div>

        <div className={`mobile-menu ${isOpen ? "show" : ""}`}>
          <nav>
            <ul>
              <li>
                <a href="#homeP" onClick={closeMenu}>
                  Home
                </a>
              </li>
              <li>
                <a href="#problems" onClick={closeMenu}>
                  Problems
                </a>
              </li>
              <li>
                <a href="#challenges" onClick={closeMenu}>
                  Challenge
                </a>
              </li>
              <li>
                <button className="logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbarhome;
