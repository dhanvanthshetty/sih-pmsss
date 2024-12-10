// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1]; // Extract token part

  console.log("Token received:", token); // Log the received token

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
    console.log("Decoded token:", decoded); // Log the decoded token
    req.user = decoded; // Attach decoded user info to request object
    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    return res.status(401).json({ message: 'Token verification failed' });
  }
};

module.exports = authMiddleware;
