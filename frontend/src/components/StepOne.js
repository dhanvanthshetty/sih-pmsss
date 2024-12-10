// src/components/StepOne.js
import React, { useState } from 'react';
import { register } from '../services/authService'; // Ensure this import is correct

function StepOne({ onNext }) {
  const [mobile, setMobile] = useState('');
  const [aadharNumber, setAadharNumber] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleProceed = async () => {
    if (!mobile || !aadharNumber || !name || !email) {
      setError('Please fill in all fields.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const response = await register(mobile, aadharNumber, name, email);
      console.log(response); // For debugging
      onNext({ mobile, aadharNumber, name, email });
    } catch (err) {
      setError(err.message || 'An error occurred during registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Step 1: Enter Details</h2>
      <input
        type="text"
        value={mobile}
        onChange={(e) => setMobile(e.target.value)}
        placeholder="Enter your mobile number"
        maxLength="15"
      />
      <input
        type="text"
        value={aadharNumber}
        onChange={(e) => setAadharNumber(e.target.value)}
        placeholder="Enter AADHAR number"
        maxLength="15"
      />
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter your name"
        maxLength="100"
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
      />
      <button onClick={handleProceed} disabled={loading}>
        {loading ? 'Processing...' : 'Next'}
      </button>
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default StepOne;
