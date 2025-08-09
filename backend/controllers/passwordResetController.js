const PasswordResetRequest = require('../models/passwordResetSchema');
const Student = require('../models/studentSchema');
const Teacher = require('../models/teacherSchema');
const Admin = require('../models/adminSchema');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

// Generate unique reset token
const generateResetToken = () => {
    return crypto.randomBytes(32).toString('hex');
};

// Create password reset request
const createPasswordResetRequest = async (req, res) => {
    try {
        const { email, userType, admissionNum, studentName } = req.body;

        let user;
        let userEmail = email;

        // Find user based on type and provided info
        if (userType === 'student') {
            user = await Student.findOne({ 
                admissionNum: admissionNum,
                name: studentName 
            });
            if (!user) {
                return res.status(404).json({ message: 'Student not found' });
            }
            userEmail = `${user.admissionNum}@gundua.school`;
        } else if (userType === 'teacher') {
            user = await Teacher.findOne({ email });
            if (!user) {
                return res.status(404).json({ message: 'Teacher not found' });
            }
        } else if (userType === 'admin') {
            user = await Admin.findOne({ email });
            if (!user) {
                return res.status(404).json({ message: 'Admin not found' });
            }
        }

        // Check for existing pending request
        const existingRequest = await PasswordResetRequest.findOne({
            userId: user._id,
            userType,
            status: 'pending'
        });

        if (existingRequest) {
            return res.status(400).json({ 
                message: 'Password reset request already pending' 
            });
        }

        // Create new reset request
        const resetToken = generateResetToken();
        const resetRequest = new PasswordResetRequest({
            userId: user._id,
            userType,
            email: userEmail,
            resetToken
        });

        await resetRequest.save();

        res.status(201).json({
            message: 'Password reset request submitted successfully',
            requestId: resetRequest._id
        });

    } catch (error) {
        console.error('Error creating password reset request:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get all pending password reset requests
const getPendingResetRequests = async (req, res) => {
    try {
        const pendingRequests = await PasswordResetRequest.find({ status: 'pending' })
            .populate('userId', 'name email admissionNum')
            .sort({ createdAt: -1 });

        res.status(200).json(pendingRequests);
    } catch (error) {
        console.error('Error fetching pending requests:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Process password reset
const processPasswordReset = async (req, res) => {
    try {
        const { requestId } = req.params;
        const { newPassword } = req.body;

        const resetRequest = await PasswordResetRequest.findById(requestId);
        if (!resetRequest) {
            return res.status(404).json({ message: 'Reset request not found' });
        }

        if (resetRequest.status !== 'pending') {
            return res.status(400).json({ message: 'Request already processed' });
        }

        // Find user and update password
        let user;
        if (resetRequest.userType === 'student') {
            user = await Student.findById(resetRequest.userId);
        } else if (resetRequest.userType === 'teacher') {
            user = await Teacher.findById(resetRequest.userId);
        } else if (resetRequest.userType === 'admin') {
            user = await Admin.findById(resetRequest.userId);
        }

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Hash the new password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        
        user.password = hashedPassword;
        await user.save();

        // Update reset request status
        resetRequest.status = 'processed';
        resetRequest.processedAt = new Date();
        await resetRequest.save();

        res.status(200).json({
            message: 'Password reset successfully',
            user: {
                id: user._id,
                name: user.name,
                email: resetRequest.email,
                type: resetRequest.userType
            }
        });

    } catch (error) {
        console.error('Error processing password reset:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get reset request count
const getResetRequestCount = async (req, res) => {
    try {
        const count = await PasswordResetRequest.countDocuments({ status: 'pending' });
        res.status(200).json({ count });
    } catch (error) {
        console.error('Error getting request count:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    createPasswordResetRequest,
    getPendingResetRequests,
    processPasswordReset,
    getResetRequestCount
};
