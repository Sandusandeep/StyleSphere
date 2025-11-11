import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Login.css"; // reuse same CSS
import axios from "axios";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name || !email || !password || !age) {
      setError("All fields are required");
      return;
    }

    try {
      const API_URL =
        process.env.REACT_APP_API_URL || "https://stylesphere-q6vb.onrender.com/api/auth";

      const response = await axios.post(`${API_URL}/signup`, {
        name,
        email,
        password,
        age,
      });

      if (response.data.token) {
        // Show success message
        setSuccess("Account created successfully! Redirecting to login...");

        // Wait 2 seconds and navigate to login page
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        setError(response.data.message || "Signup failed");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="app-name">StyleSphere</h1>
        <form onSubmit={handleSignup}>
          <div className="input-group">
            <label>Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Age</label>
            <input
              type="number"
              placeholder="Enter your age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
            />
          </div>

          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}

          <button type="submit" className="login-btn">
            Sign Up
          </button>
        </form>
        <p className="switch-auth">
          Already have an account?{" "}
          <Link to="/" className="switch-link">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
