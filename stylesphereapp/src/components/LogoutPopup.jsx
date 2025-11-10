// src/components/LogoutPopup.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const LogoutPopup = ({ onClose }) => {
  const navigate = useNavigate();
  const { logout } = useAuth(); // ✅ works only if provider wraps app

  const handleLogout = () => {
    logout(); // clears token, keeps email
    onClose();
    navigate("/"); // redirect to login
  };

  return (
    <div className="logout-popup">
      <div className="popup-content">
        <h2>Logout Confirmation</h2>
        <p>Are you sure you want to log out?</p>
        <div className="popup-buttons">
          <button className="confirm-btn" onClick={handleLogout}>
            Yes, Logout
          </button>
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutPopup;
