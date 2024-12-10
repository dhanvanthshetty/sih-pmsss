const jwt = require('jsonwebtoken');
const FinanceUser = require('../models/FinanceUser');

// Login with username and password
const financeLogin = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find the user by username
    const user = await FinanceUser.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials: user not found' });
    }

    // Check if password matches (calling instance method)
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials: password mismatch' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, {
      expiresIn: '11h',
    });

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Error logging in:', error); // Log the actual error to the console
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};

module.exports = { financeLogin };
