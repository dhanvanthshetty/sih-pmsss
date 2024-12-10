// src/components/StepTwo.js
import React, { useState, useEffect } from 'react';
import { verifyEmailOtp } from '../services/authService'; // Ensure this import is correct
import { useNavigate } from 'react-router-dom';

function StepTwo({ onNext, userDetails }) {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(0);
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleVerifyOtp = async () => {
    if (!userDetails) {
      setError('User details are not available.');
      return;
    }
    
    try {
      const response = await verifyEmailOtp(userDetails.email, otp, userDetails.mobile, userDetails.aadharNumber, userDetails.name);
      console.log(response); // For debugging
      // Display success message and redirect
      alert('Successfully verified. Redirecting to login...');
      setTimeout(() => navigate('/login'), 5000); // Redirect after 5 seconds
    } catch (err) {
      setError('Invalid OTP. Please try again.');
    }
  };

  const handleResendOtp = async () => {
    if (!userDetails) {
      setError('User details are not available.');
      return;
    }
    
    try {
      await fetch('/register', { // Resend OTP by hitting the /register endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userDetails.email,
          mobile: userDetails.mobile,
          aadharNumber: userDetails.aadharNumber,
          name: userDetails.name,
        }),
      });
      setError('OTP resent. Please check your email.');
      setTimer(60); // Reset timer for resend
    } catch (err) {
      setError('Failed to resend OTP. Please try again.');
    }
  };

  return (
    <div>
      <h2>Email Verification</h2>
      <label>Email</label>
      <input
        type="email"
        value={userDetails.email}
        readOnly
      />
      <label>Enter OTP</label>
      <input
        type="text"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="Enter OTP"
      />
      <button onClick={handleVerifyOtp}>Verify OTP</button>
      {error && <p className="error">{error}</p>}
      <button onClick={handleResendOtp} disabled={timer > 0}>
        {timer > 0 ? `Resend OTP in ${timer}s` : 'Resend OTP'}
      </button>
    </div>
  );
}

export default StepTwo;
