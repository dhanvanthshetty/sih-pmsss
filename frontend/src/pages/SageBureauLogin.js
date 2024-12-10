// src/pages/SageBureauLogin.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './SageBureauLogin.css'; // Ensure the path to your CSS file is correct

function SageBureauLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Initialize navigation

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/sage/sage-bureau-login', { username, password });
      const { token } = response.data; // Extract token from the response
      localStorage.setItem('token', token); // Store token in localStorage
      navigate('/sage-dashboard'); // Redirect to dashboard on successful login
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <div className="form-box">
        <h2>Sage Bureau Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-box">
            <input
              type="text"
              placeholder=""
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <label>Username</label>
          </div>
          <div className="input-box">
            <input
              type="password"
              placeholder=""
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label>Password</label>
          </div>
          <button type="submit" className="btn">Login</button>
          {error && <p className="error">{error}</p>}
        </form>
        <div className="links">
          <button className="forgot-password">Forgot password?</button>
        </div>
      </div>
    </div>
  );
}

export default SageBureauLogin;