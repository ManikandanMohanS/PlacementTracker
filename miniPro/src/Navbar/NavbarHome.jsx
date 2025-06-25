import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../login/FirebaseConfig";
import { signOut } from "firebase/auth";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./NavbarH.module.css";

const Navbarhome = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Logout Error:", error.message);
    }
  };

  return (
    <nav className={`navbar navbar-expand-lg fixed-top ${styles.navbarCustom}`}>
      <div className={`container-fluid ${styles.containerCustom}`}>
        {/* Logo/Brand */}
        <a className={`navbar-brand ${styles.glowOnHover}`} href="#homeP" onClick={closeMenu}>
          <span className={styles.logoText}>Placement Tracker</span>
          <span className={styles.logoDot}>.</span>
        </a>

        {/* Hamburger Icon */}
        <button
          className={`navbar-toggler ${styles.togglerCustom}`}
          type="button"
          onClick={toggleMenu}
          aria-label="Toggle navigation"
        >
          <span className={styles.togglerIcon}></span>
        </button>

        {/* Main Navbar Content */}
        <div className={`collapse navbar-collapse ${isOpen ? "show" : ""} ${styles.collapseCustom}`}>
          <ul className={`navbar-nav me-auto mb-2 mb-lg-0 ${styles.navCustom}`}>
            <NavItem href="#homeP" text="Home" closeMenu={closeMenu} active styles={styles} />
            <NavItem href="#problems" text="Problems" closeMenu={closeMenu} styles={styles} />
            <NavItem href="#challenges" text="Challenge" closeMenu={closeMenu} styles={styles} />
          </ul>

          {/* Logout Button */}
          <div className={styles.logoutWrapper}>
            <button className={styles.btnLogout} onClick={handleLogout}>
              <span className={styles.btnText}>Logout</span>
              <span className={styles.btnIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/>
                  <path d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
                </svg>
              </span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

const NavItem = ({ href, text, closeMenu, active = false, styles }) => (
  <li className={`nav-item ${styles.navItemCustom}`}>
    <a
      className={`nav-link ${active ? styles.active : ""} ${styles.navLinkCustom}`}
      href={href}
      onClick={closeMenu}
    >
      {text}
      <span className={styles.navLinkUnderline}></span>
    </a>
  </li>
);

export default Navbarhome;