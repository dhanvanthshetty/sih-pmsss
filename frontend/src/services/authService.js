// src/services/authService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth'; // Ensure this URL is correct

export const register = async (mobile, aadharNumber, name, email) => {
  try {
    const response = await axios.post(`${API_URL}/register`, { mobile, aadharNumber, name, email });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    } else {
      throw new Error('Network error');
    }
  }
};

export const verifyEmailOtp = async (email, otp, mobile, aadharNumber, name) => {
  try {
    const response = await axios.post(`${API_URL}/verify-otp`, { email, otp, mobile, aadharNumber, name });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    } else {
      throw new Error('Network error');
    }
  }
};
export const login = async (sid, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { sid, password });

    if (response.data.token) {
      localStorage.setItem('token', response.data.token); // Store the token
      console.log('Token stored:', response.data.token); // Log the stored token
    }

    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    } else {
      throw new Error('Network error');
    }
  }
};


export const getProfile = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found');
  }

  try {
    const response = await axios.get(`${API_URL}/profile`, {
      headers: {
        Authorization: `Bearer ${token}`, // Correctly set the Authorization header
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching profile:', error); // Log the error for debugging
    if (error.response) {
      throw error.response.data;
    } else {
      throw new Error('Network error');
    }
  }
};
