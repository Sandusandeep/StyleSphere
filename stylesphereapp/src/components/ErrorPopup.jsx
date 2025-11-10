// src/components/ErrorPopup.jsx
import React from "react";
import { motion } from "framer-motion";

/**
 * ErrorPopup shows error messages in a dismissible animated popup.
 * Usage: <ErrorPopup message={msg} onClose={() => setMsg(null)} />
 */
const ErrorPopup = ({ message, onClose }) => {
  if (!message) return null;
  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -50, opacity: 0 }}
      style={{
        position: "fixed",
        top: 20,
        right: 20,
        background: "#ffeded",
        color: "#b00020",
        border: "1px solid #f5c2c2",
        padding: "12px 18px",
        borderRadius: 8,
        zIndex: 1000,
        boxShadow: "0 6px 20px rgba(0,0,0,0.12)",
      }}
    >
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <strong>Error:</strong>
        <div style={{ flex: 1 }}>{message}</div>
        <button
          onClick={onClose}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
          }}
        >
          ✕
        </button>
      </div>
    </motion.div>
  );
};

export default ErrorPopup;
