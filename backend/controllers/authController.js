const { sendOtpToEmail, sendCredentialsToEmail } = require('../services/otpService');
const User = require('../models/User');
const EmailOtp = require('../models/EmailOtp');
const crypto = require('crypto');
const jwt = require('jsonwebtoken'); 

// Generate OTP
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// generate a random alphanumeric string for SID
const generateRandomAlphanumeric = (length) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Generate a six-digit random number for password
const generateSixDigitNumber = () => Math.floor(100000 + Math.random() * 900000).toString();

// Registration Process (Step 1)
// exports.register = async (req, res) => {
//   const { mobile, aadharNumber, name, email } = req.body;

//   if (!mobile || !aadharNumber || !name || !email) {
//     return res.status(400).json({ message: 'All fields are required' });
//   }

//   try {
//     // Check if the user already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: 'User already exists' });
//     }

//     // Generate OTP and expiration time
//     const otp = generateOtp();
//     const expiresAt = new Date(Date.now() + 5 * 60000); // OTP expires in 5 minutes

//     // Save OTP in EmailOtp model
//     const emailOtp = new EmailOtp({ email, otp, expiresAt });
//     await emailOtp.save();
//     console.log(`Saved OTP for email ${email}: ${otp}`);

//     // Send OTP via email
//     try {
//       await sendOtpToEmail(email, otp);
//       console.log(`OTP sent successfully to ${email}`);
//     } catch (error) {
//       console.error(`Failed to send OTP to ${email}:`, error);
//       throw new Error('Failed to send OTP. Please try again.');
//     }
    
//     console.log('OTP sent to email:', otp);
//     console.log('Expires At:', expiresAt);

//     res.status(200).json({ message: 'OTP sent to email. Please verify to complete registration.' });
//   } catch (error) {
//     console.error('Error during registration:', error.message);
//     res.status(500).json({ message: 'Error during registration', error: error.message });
//   }
// };
exports.register = async (req, res) => {
  const { mobile, aadharNumber, name, email } = req.body;

  if (!mobile || !aadharNumber || !name || !email) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60000);

    // Overwrite or save new OTP
    await EmailOtp.findOneAndUpdate(
      { email },
      { otp, expiresAt },
      { upsert: true }
    );

    await sendOtpToEmail(email, otp);

    console.log(`OTP sent to email ${email}: ${otp}`);
    res.status(200).json({ message: 'OTP sent to email. Please verify to complete registration.' });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Error during registration', error: error.message });
  }
};


exports.verifyEmailOtp = async (req, res) => {
  const { email, otp, mobile, aadharNumber, name } = req.body;

  if (!email || !otp || !mobile || !aadharNumber || !name) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Find OTP for the email
    const emailOtp = await EmailOtp.findOne({ email });

    if (!emailOtp) {
      return res.status(400).json({ message: 'OTP not found. Please register first.' });
    }

    
    if (new Date() > new Date(emailOtp.expiresAt)) {
      return res.status(400).json({ message: 'OTP expired. Please request a new OTP.' });
    }

    // Verify OTP
    if (emailOtp.otp === otp) {
      // OTP verified successfully
      const sidPrefix = 'PMSS';
      const sidSuffix = generateRandomAlphanumeric(6);
      const sid = `${sidPrefix}${sidSuffix}`;
      const password = generateSixDigitNumber();

      // Create or update the user
      const newUser = await User.findOneAndUpdate(
        { email },
        {
          mobile,
          aadharNumber,
          name,
          sid,
          password,
          status: 'active',
        },
        { new: true, upsert: true }
      );

      // Remove the OTP after successful verification
      await EmailOtp.deleteOne({ email });

      // Send the SID and password to the user's email
      await sendCredentialsToEmail(email, sid, password);

      res.status(200).json({ message: 'OTP verified, user created successfully', sid, password });
    } else {
      res.status(400).json({ message: 'Invalid OTP' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error during OTP verification', error: error.message });
  }
};


// Login function
exports.login = async (req, res) => {
  const { sid, password } = req.body;

  if (!sid || !password) {
    return res.status(400).json({ message: 'SID and password are required' });
  }

  try {
    // Find user by SID
    const user = await User.findOne({ sid });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify password (assuming the password is stored in plain text; use bcrypt in a real application)
    if (user.password !== password) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '10h' });

    res.status(200).json({ message: 'Login successful', token }); // Send token back to client
  } catch (error) {
    console.error('Error during login:', error.message);
    res.status(500).json({ message: 'Error during login', error: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    // `req.user` should contain the decoded token with user ID
    const userId = req.user.id;
    
    // Fetch user data from the database
    const user = await User.findById(userId).select('-password'); // Exclude password from the result
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Send user data back to the client
    res.json({
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      aadharNumber: user.aadharNumber,
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};