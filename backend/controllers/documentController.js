const fs = require('fs');
const path = require('path');
const multer = require('multer');
const Document = require('../models/Document');
const User = require('../models/User');
const sendEmail = require('../config/nodemailer');
const ApplicationStatus = require("../models/ApplicationStatus")


// Multer disk storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage }).fields([
  { name: 'testCard', maxCount: 1 },
  { name: 'marksheet', maxCount: 1 },
  { name: 'feesReceipt', maxCount: 1 },
  { name: 'collegeID', maxCount: 1 }
]);


const nodemailer = require('nodemailer'); // For sending emails

// Setup Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'Gmail', // Change to your email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Get all submitted documents
// Example route handler for fetching submitted documents
// Example route handler for fetching submitted documents
// const getSubmittedDocuments = async (req, res) => {
//   try {
//     const documents = await Document.find({ status: 'submitted' })
//       .populate('userId', 'sid name') // Populate userId field with sid and name
//       .exec();

//     res.status(200).json(documents);
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to fetch documents', error });
//   }
// };

// const getSubmittedDocuments = async (req, res) => {
//   try {
//     // Assuming that 'submitted' documents are managed by user status or another method
//     // Fetch documents with user details
//     const documents = await Document.find() // Adjust query if needed to filter documents
//       .populate({
//         path: 'userId',
//         select: 'sid name' // Only include sid and name from the user document
//       })
//       .exec();

//     res.status(200).json(documents);
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to fetch documents', error });
//   }
// };
const getSubmittedDocuments = async (req, res) => {
  try {
    const documents = await Document.find() // Find all documents first
      .populate({
        path: 'userId',
        match: { status: 'submitted' }, // Filter users with 'submitted' status
        select: 'sid name' // Only include 'sid' and 'name' from the user
      })
      .exec();

    // Filter out documents where the userId is null (i.e., those not matching 'submitted')
    const filteredDocuments = documents.filter(doc => doc.userId !== null);

    res.status(200).json(filteredDocuments);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch documents', error });
  }
};


//Get document by ID
const getDocumentById = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }
    res.json(document);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching document', error: error.message });
  }
};

// Approve document
// const approveDocument = async (req, res) => {
//   try {
//     const document = await Document.findById(req.params.id);
//     if (!document) {
//       return res.status(404).json({ message: 'Document not found' });
//     }

//     // Update document status
//     document.status = 'approved';
//     await document.save();

//     // Send approval email
//     const user = await User.findById(document.userId);
//     await transporter.sendMail({
//       to: user.email,
//       subject: 'Document Approved',
//       text: `Dear ${user.name},\n\nYour document has been approved.\n\nBest regards,\nSage Bureau`,
//     });

//     res.json({ message: 'Document approved and user notified' });
//   } catch (error) {
//     res.status(500).json({ message: 'Error approving document', error: error.message });
//   }
// };
// const approveDocument = async (req, res) => {
//   try {
//     const documentId = req.params.id;

//     // Find the document
//     const document = await Document.findById(documentId).populate('userId');
//     if (!document) {
//       return res.status(404).json({ message: 'Document not found' });
//     }

//     // Optional: Update the user's status or handle document approval logic
//     // Update user status to reflect document approval if needed
//     const user = await User.findById(document.userId._id);
//     user.status = 'approved'; // Adjust status or logic as required
//     await user.save();
//     await sendEmail(
//       user.email,
//       'Document Approved Successful',
//       'Your documents have been successfully approved  and forwarded to Finance bureau .'
//     );
//     console.log("Email sent successfully");
//     // Respond with a success message
//     res.status(200).json({ message: 'Document approved' });
//   } catch (error) {
//     res.status(500).json({ message: 'Error approving document', error });
//   }
// };
const approveDocument = async (req, res) => {
  try {
    const { userId } = req.body; // Get userId from the request body

    // Find the user (student) whose documents are being approved
    const user = await User.findById(userId).populate('documents'); // Assuming 'documents' field is referenced in the User model

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the user's status to 'approved'
    user.status = 'approved';

    // Mark all user's documents as 'approved'
    await Document.updateMany({ userId }, { status: 'approved' });

    // Save the user with the new status
    await user.save();

    let applicationStatus = await ApplicationStatus.findOne({ userId: user._id });
      if (!applicationStatus) {
        applicationStatus = new ApplicationStatus({ userId: user._id });
      }
      applicationStatus.approvedBySigBureau = true;
      applicationStatus.timestamps.submittedAt = new Date();
      await applicationStatus.save();

    // Send approval email notification to the user (student)
    await sendEmail(
      user.email,
      'Document Approval',
      'All your documents have been approved successfully.'
    );

    res.status(200).json({ message: 'User and all documents approved successfully' });
  } catch (error) {
    console.error('Error approving user documents:', error);
    res.status(500).json({ message: 'Error approving user documents', error });
  }
};

const rejectDocument = async (req, res) => {
  try {
    const documentId = req.params.id; // Get document ID from URL params

    // Find the document
    const document = await Document.findById(documentId).populate('userId');
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Optional: Update the user's status or handle document rejection logic
    const user = await User.findById(document.userId._id);
    user.status = 'rejected'; // Adjust status or logic as required
    await user.save();

    // Send feedback email to the user
    await sendEmail(
      user.email,
      'Document Rejection',
      `Your document was rejected for the following reason:\n\n${feedback}`
    );

    res.status(200).json({ message: 'Document rejected and email sent' });
  } catch (error) {
    console.error('Error rejecting document:', error);
    res.status(500).json({ message: 'Error rejecting document', error });
  }
};




// Upload documents handler
const uploadDocuments = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error('File upload error:', err); // Detailed error logging
      return res.status(500).json({ message: 'File upload failed', error: err });
    }

    try {
      const userId = req.user.id; // Get the user ID from the request
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Prepare an array of documents to save
      const documents = [];
      ['testCard', 'marksheet', 'feesReceipt', 'collegeID'].forEach((docType) => {
        if (req.files[docType]) {
          const newDocument = new Document({
            userId: user._id,
            type: docType,
            filePath: req.files[docType][0].path,
          });
          documents.push(newDocument);
        }
      });

      // Save the documents to the database
      await Document.insertMany(documents);
      
      // Update user's document references and status
      user.documents.push(...documents.map(doc => doc._id));
      user.status = 'submitted'; // Update the user's status
      await user.save();

      // Update ApplicationStatus to set applicationSubmitted to true
      let applicationStatus = await ApplicationStatus.findOne({ userId: user._id });
      if (!applicationStatus) {
        applicationStatus = new ApplicationStatus({ userId: user._id });
      }
      applicationStatus.applicationSubmitted = true;
      applicationStatus.timestamps.submittedAt = new Date();
      await applicationStatus.save();

      // Send confirmation email
      await sendEmail(
        user.email,
        'Document Submission Successful',
        'Your documents have been successfully submitted and are being processed.'
      );
      console.log("Email sent successfully");

      res.status(201).json({ message: 'Documents uploaded successfully', documents });
    } catch (error) {
      console.error('Error saving documents:', error); // Detailed error logging
      res.status(500).json({ message: 'Error saving documents', error });
    }
  });
};



// Get all documents for the user
const getDocuments = async (req, res) => {
  try {
    const userId = req.user.id;
    const documents = await Document.find({ userId });

    res.status(200).json(documents);
  } catch (error) {
    console.error('Error retrieving documents:', error); // Detailed error logging
    res.status(500).json({ message: 'Error retrieving documents', error });
  }
};

// Delete document handler
const deleteDocument = async (req, res) => {
  try {
    const { type } = req.body;
    const userId = req.user.id;

    if (!type) {
      return res.status(400).json({ message: 'Document type is required' });
    }

    // Find the document to delete
    const document = await Document.findOne({ userId, type });

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Delete the file from disk
    const filePath = path.resolve(__dirname, '../uploads', path.basename(document.filePath));
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete the document record from the database
    await Document.deleteOne({ _id: document._id });

    // Optionally update user's documents list
    const user = await User.findById(userId);
    if (user) {
      user.documents.pull(document._id);
      await user.save();
    }

    res.status(200).json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Error deleting document:', error);
    res.status(500).json({ message: 'Error deleting document', error });
  }
};

module.exports = { getSubmittedDocuments,  rejectDocument
,  getDocumentById, approveDocument,uploadDocuments, getDocuments,deleteDocument };
