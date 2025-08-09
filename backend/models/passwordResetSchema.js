const mongoose = require('mongoose');

const passwordResetSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'userType'
    },
    userType: {
        type: String,
        required: true,
        enum: ['student', 'teacher', 'admin']
    },
    email: {
        type: String,
        required: true
    },
    resetToken: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: String,
        enum: ['pending', 'processed', 'expired'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 3600 // Token expires after 1 hour
    },
    processedAt: {
        type: Date
    }
});

module.exports = mongoose.model("PasswordResetRequest", passwordResetSchema);
