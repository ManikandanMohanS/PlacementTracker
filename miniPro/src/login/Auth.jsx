import React, { useState } from "react";
import { auth } from "./FirebaseConfig";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import styles from "./loginpage.module.css"; // Import styles as a module

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle Sign Up
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

  // Handle Login
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

  // Handle Logout
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
    <div className={styles["page-container"]}>
      <div className={styles.container}>
        <h2>{isRegistering ? "Register" : "Login"}</h2>

        {error && <p>{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {isRegistering ? (
          <button onClick={handleSignUp} disabled={loading}>
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        ) : (
          <button onClick={handleLogin} disabled={loading}>
            {loading ? "Logging In..." : "Login"}
          </button>
        )}

        <button onClick={() => setIsRegistering(!isRegistering)} disabled={loading}>
          {isRegistering ? "Already have an account? Login" : "Don't have an account? Sign Up"}
        </button>

        {user && (
          <div>
            <p>Welcome, {user.email}</p>
            <button onClick={handleLogout} disabled={loading}>
              {loading ? "Logging Out..." : "Logout"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Auth;
