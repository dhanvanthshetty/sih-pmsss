// const User = require('../models/User');
// const nodemailer = require('nodemailer'); // Assuming you're using Nodemailer

// const rejectUser = async (req, res) => {
//   const { id } = req.params;
//   const { feedback } = req.body; // Get feedback from request body

//   try {
//     const user = await User.findById(id);

//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     user.status = 'rejected'; // Set user status to rejected
//     await user.save();

//     // Send rejection email with feedback
//     const transporter = nodemailer.createTransport({
//       service: 'Gmail',
//       auth: {
//         user: process.env.EMAIL_SENDER,
//         pass: process.env.EMAIL_PASSWORD,
//       },
//     });

//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to: user.email, // Assuming the user model has an email field
//       subject: 'Document Rejection Feedback',
//       text: `Your document has been rejected. Feedback: ${feedback}`,
//     };

//     await transporter.sendMail(mailOptions);

//     res.status(200).json({ message: 'User rejected successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Error rejecting user', error });
//   }
// };

// const getApprovedUsers = async (req, res) => {
//     try {
//       const approvedUsers = await User.find({ status: 'approved' });
//       res.status(200).json(approvedUsers);
//     } catch (error) {
//       res.status(500).json({ message: 'Error retrieving approved users', error });
//     }
//   };

//   const pushToDbt = async (req, res) => {
//     const { id } = req.params;
  
//     try {
//       const user = await User.findById(id);
  
//       if (!user) {
//         return res.status(404).json({ message: 'User not found' });
//       }
  
//       user.status = 'pushtodbt';
//       await user.save();
  
//       let applicationStatus = await ApplicationStatus.findOne({ userId: user._id });
//       if (!applicationStatus) {
//         applicationStatus = new ApplicationStatus({ userId: user._id });
//       }
//       applicationStatus.pushedToDbt = true;
//       applicationStatus.timestamps = {
//         ...applicationStatus.timestamps,
//         pushedAt: new Date(),
//       };
//       await applicationStatus.save();
  
//       const transporter = nodemailer.createTransport({
//         service: 'Gmail',
//         auth: {
//           user: process.env.EMAIL_SENDER,
//           pass: process.env.EMAIL_PASSWORD,
//         },
//       });
  
//       const mailOptions = {
//         from: process.env.EMAIL_USER,
//         to: user.email,
//         subject: 'DBT Process Initiated',
//         text: `Dear ${user.name}, your application has been pushed to DBT. You will receive further updates soon.`,
//       };
  
//       await transporter.sendMail(mailOptions);
  
//       res.status(200).json({ message: 'User pushed to DBT and email sent successfully' });
//     } catch (error) {
//       console.error('Error in pushToDbt:', error);
//       res.status(500).json({ message: 'Error pushing to DBT', error });
//     }
//   };
  
  
  

// module.exports = { rejectUser,getApprovedUsers,pushToDbt };



const User = require('../models/User');
const ApplicationStatus = require('../models/ApplicationStatus'); // Import ApplicationStatus model
const nodemailer = require('nodemailer'); // Assuming you're using Nodemailer

const rejectUser = async (req, res) => {
  const { id } = req.params;
  const { feedback } = req.body; // Get feedback from request body

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.status = 'rejected'; // Set user status to rejected
    await user.save();

    // Send rejection email with feedback
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_SENDER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email, // Assuming the user model has an email field
      subject: 'Document Rejection Feedback',
      text: `Your document has been rejected. Feedback: ${feedback}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'User rejected successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error rejecting user', error });
  }
};

const getApprovedUsers = async (req, res) => {
  try {
    const approvedUsers = await User.find({ status: 'approved' });
    res.status(200).json(approvedUsers);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving approved users', error });
  }
};

const pushToDbt = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.status = 'pushtodbt';
    await user.save();

    let applicationStatus = await ApplicationStatus.findOne({ userId: user._id });
    if (!applicationStatus) {
      applicationStatus = new ApplicationStatus({ userId: user._id });
    }
    applicationStatus.pushedToDbt = true;
    applicationStatus.timestamps = {
      ...applicationStatus.timestamps,
      pushedAt: new Date(),
    };
    await applicationStatus.save();

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_SENDER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'DBT Process Initiated',
      text: `Dear ${user.name}, your application has been pushed to DBT. You will receive further updates soon.`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'User pushed to DBT and email sent successfully' });
  } catch (error) {
    console.error('Error in pushToDbt:', error);
    res.status(500).json({ message: 'Error pushing to DBT', error });
  }
};

module.exports = { rejectUser, getApprovedUsers, pushToDbt };
