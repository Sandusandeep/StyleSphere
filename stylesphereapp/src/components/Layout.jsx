// src/components/Layout.jsx
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const Layout = ({ children }) => {
  const { user, logout } = useContext(AuthContext);
  return (
    <div>
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 24px",
          background: "#fff",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}
      >
        <div>
          <Link
            to="/"
            style={{
              textDecoration: "none",
              color: "#222",
              fontWeight: 700,
              fontSize: 20,
            }}
          >
            Stylesphere
          </Link>
        </div>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <Link to="/products">Products</Link>
          <Link to="/favourites">Favourites</Link>
          <Link to="/cart">Cart</Link>
          {user ? (
            <>
              <span style={{ marginLeft: 8 }}>{user.name || user.email}</span>
              <button onClick={logout} style={{ marginLeft: 8 }}>
                Logout
              </button>
            </>
          ) : (
            <Link to="/login">Login / Signup</Link>
          )}
        </div>
      </nav>

      <main style={{ padding: 24 }}>{children}</main>

      <footer
        style={{
          padding: 24,
          borderTop: "1px solid #eee",
          textAlign: "center",
        }}
      >
        © {new Date().getFullYear()} Stylesphere — All rights reserved
      </footer>
    </div>
  );
};

export default Layout;
