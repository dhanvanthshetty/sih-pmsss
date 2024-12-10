const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  studentId: mongoose.Schema.Types.ObjectId,
  status: String,
  documents: [mongoose.Schema.Types.ObjectId],
});

module.exports = mongoose.model('Application', applicationSchema);
