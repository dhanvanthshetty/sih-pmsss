const jwt = require('jsonwebtoken');
const ApplicationStatus = require('../models/ApplicationStatus');
const User = require('../models/User');

// Helper function to extract the userId from the JWT token
const extractUserIdFromToken = (req) => {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer token
    if (!token) throw new Error('No token provided');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.userId;
};

// Get status by userId
const getStatusByUserId = async (req, res) => {
    try {
      const userId = extractUserIdFromToken(req);
      console.log(userId) // Extract userId from token
      const status = await ApplicationStatus.findOne({ userId });
  
      if (!status) {
        return res.status(404).json({ message: 'Application status not found' });
      }
  
      res.status(200).json(status);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving status', error: error.message });
    }
  };
  

// Update application status
const updateStatus = async (req, res) => {
    try {
        const userId = extractUserIdFromToken(req);
        const { stage } = req.body;

        const status = await ApplicationStatus.findOne({ userId });
        if (!status) return res.status(404).json({ message: 'Application status not found' });

        const currentTime = new Date();
        if (stage === 'applicationSubmitted') {
            status.applicationSubmitted = true;
            status.timestamps.submittedAt = currentTime;
        } else if (stage === 'approvedBySigBureau') {
            status.approvedBySigBureau = true;
            status.timestamps.approvedAt = currentTime;
        } else if (stage === 'pushedToDbt') {
            status.pushedToDbt = true;
            status.timestamps.pushedAt = currentTime;
        }

        await status.save();
        res.status(200).json({ message: 'Status updated successfully', status });
    } catch (error) {
        res.status(500).json({ message: 'Error updating status', error: error.message });
    }
};

module.exports = {
    getStatusByUserId,
    updateStatus,
};
