import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Typography,
    Box,
    CircularProgress
} from '@mui/material';
import { createPasswordResetRequest } from '../redux/passwordResetRelated/passwordResetHandle';
import { useDispatch } from 'react-redux';

const ForgotPasswordModal = ({ open, onClose, role }) => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        email: '',
        admissionNum: '',
        studentName: '',
        userType: role.toLowerCase()
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await dispatch(createPasswordResetRequest(formData));
            setSuccess(true);
            setTimeout(() => {
                handleClose();
            }, 3000);
        } catch (err) {
            setError(err.message || 'Failed to send reset request');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setFormData({
            email: '',
            admissionNum: '',
            studentName: '',
            userType: role.toLowerCase()
        });
        setSuccess(false);
        setError('');
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>Forgot Password</DialogTitle>
            <DialogContent>
                {success ? (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                        <Typography variant="h6" color="success.main" gutterBottom>
                            Request Submitted Successfully!
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Your password reset request has been sent to the administrator.
                            You will be notified once your password has been reset.
                        </Typography>
                    </Box>
                ) : (
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            Enter your details below to request a password reset. An administrator will process your request.
                        </Typography>

                        {role === 'Student' ? (
                            <>
                                <TextField
                                    fullWidth
                                    label="Admission Number"
                                    name="admissionNum"
                                    value={formData.admissionNum}
                                    onChange={handleInputChange}
                                    required
                                    margin="normal"
                                    type="number"
                                />
                                <TextField
                                    fullWidth
                                    label="Full Name"
                                    name="studentName"
                                    value={formData.studentName}
                                    onChange={handleInputChange}
                                    required
                                    margin="normal"
                                />
                            </>
                        ) : (
                            <TextField
                                fullWidth
                                label="Email Address"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                                margin="normal"
                            />
                        )}

                        {error && (
                            <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                                {error}
                            </Typography>
                        )}
                    </Box>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                {!success && (
                    <Button
                        type="submit"
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Send Request'}
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default ForgotPasswordModal;
