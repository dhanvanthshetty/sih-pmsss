import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import for navigation
import './Bureaulogin.css'; // Ensure this path is correct

function BureauLogin({ apiEndpoint }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Initialize navigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(apiEndpoint, { username, password });
      // Handle successful login
      const { token } = response.data; // Extract the token from the response
      localStorage.setItem('token', token); // Store the token in local storage
      navigate('/dashboard'); // Redirect to the dashboard or another page
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <div className="form-box">
        <h2>Bureau Login</h2>
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

export default BureauLogin;
