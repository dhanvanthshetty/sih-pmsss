const { sendSMS, sendEmail } = require('../controllers/notificationController');

const notifyUser = (user, message) => {
  sendSMS(user.mobile, message);
  sendEmail(user.email, 'Notification', message);
};

module.exports = { notifyUser };
