import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebaseConfig";
import { signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import "./NavBar.css";

const NavBar: React.FC = () => {
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error: any) {
      alert("Logout failed: " + error.message);
    }
  };

  return (
    <nav style={{ padding: "1rem", borderBottom: "1px solid #ccc", display: "flex", alignItems: "center" }}>
      <Link to="/">
        <button className="nav-btn">Home</button>
      </Link>
      {loading && <span style={{ marginLeft: "1rem" }}>Loading...</span>}
      {error && <span style={{ color: "red", marginLeft: "1rem" }}>Auth Error</span>}
      {!loading && !user && (
        <Link to="/login" style={{ marginLeft: "auto" }}>
          <button className="nav-btn">Login</button>
        </Link>
      )}
      {!loading && user && (
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center" }}>
          {/* Make welcome text a clickable link to profile */}
          <Link to="/profile" style={{ marginRight: "1rem", textDecoration: "underline", cursor: "pointer", color: 'inherit' }}>
            Welcome, {user.displayName || user.email}
          </Link>
          <Link to="/order-history">
            <button className="nav-btn">Order History</button>
          </Link>
          <button className="nav-btn" onClick={handleLogout}>Logout</button>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
