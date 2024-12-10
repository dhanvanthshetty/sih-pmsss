const express = require('express');
const jwt = require('jsonwebtoken');
const ApplicationStatus = require('../models/ApplicationStatus');

const router = express.Router();

// Middleware to extract userId from JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Token missing' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });

    req.user = user; // Decoded token contains the user ID
    next();
  });
};

// GET application status for a user
router.get('/application-status', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch the application status from the database
    const applicationStatus = await ApplicationStatus.findOne({ userId });

    if (!applicationStatus) {
      return res.status(404).json({ message: 'Application status not found' });
    }

    res.status(200).json(applicationStatus);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching application status', error: error.message });
  }
});

module.exports = router;
