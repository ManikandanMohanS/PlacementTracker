import React, { useState } from "react";
import { auth } from "./FirebaseConfig";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import "bootstrap/dist/css/bootstrap.min.css";
 // We'll create this CSS file
import "./Auth.css"; // Ensure you have this CSS file for styling
const Auth = () => {
  // All your existing state and logic remains exactly the same
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    setLoading(true);
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      console.log("User Registered:", userCredential.user);
    } catch (error) {
      setError(error.message);
      console.error("Signup Error:", error.message);
    }
    setLoading(false);
  };

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      console.log("User Logged In:", userCredential.user);
    } catch (error) {
      setError(error.message);
      console.error("Login Error:", error.message);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      setUser(null);
      console.log("User Logged Out");
    } catch (error) {
      setError(error.message);
      console.error("Logout Error:", error.message);
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>{isRegistering ? "Create Account" : "Welcome Back"}</h2>
          <p className="auth-subtitle">
            {isRegistering ? "Join our community" : "Sign in to continue"}
          </p>
        </div>

        {error && (
          <div className="alert alert-danger auth-alert" role="alert">
            {error}
          </div>
        )}

        <div className="auth-form">
          <div className="form-group">
            <input
              type="email"
              className="form-control auth-input"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              className="form-control auth-input"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {isRegistering ? (
            <button
              className="btn auth-btn-primary"
              onClick={handleSignUp}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Creating Account...
                </>
              ) : (
                "Sign Up"
              )}
            </button>
          ) : (
            <button
              className="btn auth-btn-primary"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Signing In...
                </>
              ) : (
                "Login"
              )}
            </button>
          )}

          <button
            className="btn auth-btn-secondary"
            onClick={() => setIsRegistering(!isRegistering)}
            disabled={loading}
          >
            {isRegistering ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
          </button>

          {user && (
            <div className="auth-user-section">
              <p className="auth-welcome">Welcome, <strong>{user.email}</strong></p>
              <button
                className="btn auth-btn-logout"
                onClick={handleLogout}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Signing Out...
                  </>
                ) : (
                  "Logout"
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;