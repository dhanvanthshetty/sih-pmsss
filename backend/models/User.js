const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  mobile: { type: String, required: true },
  aadharNumber: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  sid: { type: String }, // Scholarship ID generated after verification
  password: { type: String }, // Password generated after verification
  status: { type: String, default: 'pendingVerification' }, // Status of the user
  documents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Document' }],
  applicationStatus: { type: mongoose.Schema.Types.ObjectId, ref: 'ApplicationStatus' } // Optional: Reference to ApplicationStatus
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
