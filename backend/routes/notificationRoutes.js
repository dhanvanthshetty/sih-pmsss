const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

router.post('/send', (req, res) => {
  const { to, message, subject, text } = req.body;
  if (message) {
    notificationController.sendSMS(to, message);
  }
  if (subject && text) {
    notificationController.sendEmail(to, subject, text);
  }
  res.status(200).json({ message: 'Notification sent' });
});

module.exports = router;
