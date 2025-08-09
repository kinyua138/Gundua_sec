import { createSlice } from '@reduxjs/toolkit';

const passwordResetSlice = createSlice({
    name: 'passwordReset',
    initialState: {
        pendingRequests: [],
        requestCount: 0,
        loading: false,
        error: null,
    },
    reducers: {
        fetchPendingRequestsStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        fetchPendingRequestsSuccess: (state, action) => {
            state.loading = false;
            state.pendingRequests = action.payload;
        },
        fetchPendingRequestsFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        updateRequestCount: (state, action) => {
            state.requestCount = action.payload;
        },
        removeProcessedRequest: (state, action) => {
            state.pendingRequests = state.pendingRequests.filter(
                request => request._id !== action.payload
            );
            state.requestCount = Math.max(0, state.requestCount - 1);
        },
        addNewRequest: (state, action) => {
            state.pendingRequests.unshift(action.payload);
            state.requestCount += 1;
        }
    }
});

export const {
    fetchPendingRequestsStart,
    fetchPendingRequestsSuccess,
    fetchPendingRequestsFailure,
    updateRequestCount,
    removeProcessedRequest,
    addNewRequest
} = passwordResetSlice.actions;

export default passwordResetSlice.reducer;
