import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    IconButton,
    Badge,
    Menu,
    MenuItem,
    Typography,
    Box,
    ListItemText,
    Divider,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    CircularProgress
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { fetchPendingRequests, fetchRequestCount, processPasswordReset } from '../redux/passwordResetRelated/passwordResetHandle';
import { useNavigate } from 'react-router-dom';

const PasswordResetNotification = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const { pendingRequests, requestCount, loading } = useSelector(state => state.passwordReset);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        dispatch(fetchRequestCount());
        const interval = setInterval(() => {
            dispatch(fetchRequestCount());
        }, 30000); // Check every 30 seconds
        
        return () => clearInterval(interval);
    }, [dispatch]);

    const handleNotificationClick = (event) => {
        setAnchorEl(event.currentTarget);
        dispatch(fetchPendingRequests());
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleResetPassword = (request) => {
        setSelectedRequest(request);
        setOpenDialog(true);
        setAnchorEl(null);
    };

    const handleProcessReset = async () => {
        if (newPassword !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        if (newPassword.length < 6) {
            alert('Password must be at least 6 characters');
            return;
        }

        setProcessing(true);
        try {
            await dispatch(processPasswordReset(selectedRequest._id, newPassword));
            setOpenDialog(false);
            setNewPassword('');
            setConfirmPassword('');
            setSelectedRequest(null);
            dispatch(fetchRequestCount());
        } catch (error) {
            alert(error.message || 'Failed to reset password');
        } finally {
            setProcessing(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString();
    };

    return (
        <>
            <IconButton
                color="inherit"
                onClick={handleNotificationClick}
                sx={{ mr: 2 }}
            >
                <Badge badgeContent={requestCount} color="error">
                    <NotificationsIcon />
                </Badge>
            </IconButton>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                PaperProps={{
                    sx: { width: 350, maxHeight: 400 }
                }}
            >
                <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                    <Typography variant="h6">Password Reset Requests</Typography>
                    <Typography variant="body2" color="text.secondary">
                        {requestCount} pending requests
                    </Typography>
                </Box>

                {loading ? (
                    <Box sx={{ p: 2, textAlign: 'center' }}>
                        <CircularProgress size={24} />
                    </Box>
                ) : pendingRequests.length === 0 ? (
                    <MenuItem>
                        <ListItemText primary="No pending requests" />
                    </MenuItem>
                ) : (
                    pendingRequests.map((request) => (
                        <Box key={request._id}>
                            <MenuItem onClick={() => handleResetPassword(request)}>
                                <ListItemText
                                    primary={`${request.userId?.name || 'Unknown User'}`}
                                    secondary={
                                        <Box>
                                            <Typography variant="body2" color="text.secondary">
                                                {request.userType} • {request.email}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {formatDate(request.createdAt)}
                                            </Typography>
                                        </Box>
                                    }
                                />
                            </MenuItem>
                            <Divider />
                        </Box>
                    ))
                )}

                {pendingRequests.length > 0 && (
                    <Box sx={{ p: 1, textAlign: 'center' }}>
                        <Button
                            size="small"
                            onClick={() => {
                                navigate('/Admin/password-reset-requests');
                                handleClose();
                            }}
                        >
                            View All Requests
                        </Button>
                    </Box>
                )}
            </Menu>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Reset Password</DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2 }}>
                        <Typography variant="body1" gutterBottom>
                            Reset password for: <strong>{selectedRequest?.userId?.name}</strong>
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            User Type: {selectedRequest?.userType}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            Email: {selectedRequest?.email}
                        </Typography>
                        
                        <TextField
                            fullWidth
                            label="New Password"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            margin="normal"
                            variant="outlined"
                        />
                        <TextField
                            fullWidth
                            label="Confirm Password"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            margin="normal"
                            variant="outlined"
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button
                        onClick={handleProcessReset}
                        variant="contained"
                        disabled={processing || !newPassword || !confirmPassword}
                    >
                        {processing ? <CircularProgress size={24} /> : 'Reset Password'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default PasswordResetNotification;
