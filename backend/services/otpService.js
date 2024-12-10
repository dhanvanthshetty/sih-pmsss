const nodemailer = require('nodemailer');

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_SENDER, // Your email
    pass: process.env.EMAIL_PASSWORD, // Your email password or app-specific password
  },
});

// Function to send OTP email
exports.sendOtpToEmail = async (email, otp) => {
  await transporter.sendMail({
    from: process.env.EMAIL_SENDER,
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is ${otp}`,
  });
};

// Function to send credentials email
exports.sendCredentialsToEmail = async (email, sid, password) => {
  await transporter.sendMail({
    from: process.env.EMAIL_SENDER,
    to: email,
    subject: 'Your Scholarship ID and Password',
    text: `Your SID is ${sid} and your password is ${password}. Use these to log in.`,
  });
};
