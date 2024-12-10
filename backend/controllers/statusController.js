const User = require('../models/User');

// Get the application status for the logged-in user
const getStatus = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming you are using JWT middleware to get the logged-in user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Respond with the application status
    res.status(200).json({ status: user.applicationStatus });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving status', error });
  }
};

// Update the application status
const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const userId = req.user.id; // Assuming you are using JWT middleware to get the logged-in user

    // Find and update the user's application status
    const user = await User.findByIdAndUpdate(
      userId,
      { applicationStatus: status },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'Status updated successfully', status: user.applicationStatus });
  } catch (error) {
    res.status(500).json({ message: 'Error updating status', error });
  }
};

module.exports = { getStatus, updateStatus };
