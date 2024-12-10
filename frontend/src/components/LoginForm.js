import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { login as loginService } from '../services/authService';

import '../styles/LoginRegister.css';

function LoginForm() {
  const [sspId, setSspId] = useState('');
  const [password, setPassword] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Loading state
  const { login } = useAuth(); // Use the login function from AuthContext

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when login starts
    setError(''); // Reset the error message
    try {
      const { token } = await loginService(sspId, password); // Assuming loginService returns a token
      login(token); // Set the token and authenticate
      window.location.href = '/student-dashboard'; // Redirect after login
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false); // Set loading to false after request completes
    }
  };

  const handleForgotPassword = () => {
    setShowForgotPassword(true);
  };

  return (
    <div className="login-container">
      <div className="form-box">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-box">
            <input
              type="text"
              value={sspId}
              onChange={(e) => setSspId(e.target.value)}
              required
            />
            <label>SSP ID</label>
          </div>
          <div className="input-box">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label>Password</label>
          </div>
          <button type="submit" className="btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        {error && <p className="error">{error}</p>}
        <div className="links">
          <button onClick={handleForgotPassword} className="forgot-password">Forgot Password?</button>
          <p>
            Don't have an account? <a href="/register" className="register-link">Register</a>
          </p>
        </div>
      </div>
      {showForgotPassword && (
        <div className="forgot-password-modal">
          <h3>Forgot Password</h3>
          <p>Enter your email address to receive a password reset link.</p>
          <input type="email" placeholder="Email" />
          <button className="btn">Send Reset Link</button>
          <button className="btn close" onClick={() => setShowForgotPassword(false)}>Close</button>
        </div>
      )}
    </div>
  );
}

export default LoginForm;
