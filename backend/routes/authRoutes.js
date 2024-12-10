const express = require('express');
const router = express.Router();
const { register,getProfile, verifyEmailOtp, login } = require('../controllers/authController');
const authController = require('../controllers/authController'); // Import authController
const authMiddleware = require('../middlewares/authMiddleware'); // Correctly import authMiddleware
// Route for user registration (Step 1)
router.post('/register', register);

// Route for verifying the OTP via email
router.post('/verify-otp', verifyEmailOtp);

// Route for logging in with SID and password
router.post('/login', login);
// Route to fetch the profile of the logged-in user
router.get('/profile', authMiddleware, getProfile);
module.exports = router;
