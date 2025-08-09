import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  feeStructure: null,
  loading: false,
  error: null,
};

const feeStructureSlice = createSlice({
  name: 'feeStructure',
  initialState,
  reducers: {
    fetchFeeStructureStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchFeeStructureSuccess(state, action) {
      state.loading = false;
      state.feeStructure = action.payload;
    },
    fetchFeeStructureFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    clearFeeStructure(state) {
      state.feeStructure = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  fetchFeeStructureStart,
  fetchFeeStructureSuccess,
  fetchFeeStructureFailure,
  clearFeeStructure,
} = feeStructureSlice.actions;

export default feeStructureSlice.reducer;
