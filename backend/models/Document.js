// const mongoose = require('mongoose');

// const documentSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   filename: { type: String, required: true },
//   uploadDate: { type: Date, default: Date.now },
//   metadata: { type: Object }
// });

// module.exports = mongoose.model('Document', documentSchema);

// backend/models/Document.js
// /models/Document.js
const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true }, // Document type (testCard, marksheet, etc.)
  filePath: { type: String, required: true }, // Path to the file in the local storage
});

module.exports = mongoose.model('Document', documentSchema);
