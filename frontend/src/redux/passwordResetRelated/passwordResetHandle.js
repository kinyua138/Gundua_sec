import axios from 'axios';
import {
    fetchPendingRequestsStart,
    fetchPendingRequestsSuccess,
    fetchPendingRequestsFailure,
    updateRequestCount,
    removeProcessedRequest
} from './passwordResetSlice';

const API_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:5000';

// Fetch all pending password reset requests
export const fetchPendingRequests = () => async (dispatch) => {
    try {
        dispatch(fetchPendingRequestsStart());
        const response = await axios.get(`${API_URL}/password-reset-requests`);
        dispatch(fetchPendingRequestsSuccess(response.data));
    } catch (error) {
        dispatch(fetchPendingRequestsFailure(error.message));
    }
};

// Get password reset request count
export const fetchRequestCount = () => async (dispatch) => {
    try {
        const response = await axios.get(`${API_URL}/password-reset-count`);
        dispatch(updateRequestCount(response.data.count));
    } catch (error) {
        console.error('Error fetching request count:', error);
    }
};

// Create password reset request
export const createPasswordResetRequest = (requestData) => async (dispatch) => {
    try {
        const response = await axios.post(`${API_URL}/password-reset-request`, requestData);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Failed to create password reset request';
    }
};

// Process password reset
export const processPasswordReset = (requestId, newPassword) => async (dispatch) => {
    try {
        const response = await axios.put(`${API_URL}/password-reset/${requestId}`, {
            newPassword
        });
        
        dispatch(removeProcessedRequest(requestId));
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Failed to process password reset';
    }
};
