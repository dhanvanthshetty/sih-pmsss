const client = require('../config/twilio');
const transporter = require('../config/nodemailer');

const sendSMS = (to, message) => {
  client.messages.create({
    body: message,
    from: 'your_twilio_number',
    to
  });
};

const sendEmail = (to, subject, text) => {
  transporter.sendMail({
    from: 'your_email@gmail.com',
    to,
    subject,
    text
  });
};

module.exports = { sendSMS, sendEmail };
