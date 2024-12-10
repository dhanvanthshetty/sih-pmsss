import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/LoginRegister.css';  // Include your styles

function StudentLogin() {
  const [sspId, setSspId] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth(); // Get the login function from AuthContext

  const handleSubmit = async (e) => {
    e.preventDefault();
    login({ sspId, password }); // Call login function from AuthContext
  };

  return (
    <div className="login-container">
      <div className="form-box">
        <h2>Student Login</h2>
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
          <button type="submit" className="btn">Login</button>
        </form>
      </div>
    </div>
  );
}

export default StudentLogin;
