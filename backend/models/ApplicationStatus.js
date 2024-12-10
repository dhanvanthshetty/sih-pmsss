const mongoose = require('mongoose');

const applicationStatusSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    applicationSubmitted: { type: Boolean, default: false },
    approvedBySigBureau: { type: Boolean, default: false },
    pushedToDbt: { type: Boolean, default: false },
    timestamps: {
        submittedAt: { type: Date },
        approvedAt: { type: Date },
        pushedAt: { type: Date }
    }
}, { timestamps: true });

module.exports = mongoose.model('ApplicationStatus', applicationStatusSchema);
