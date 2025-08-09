import axios from 'axios';
import {
  fetchFeeStructureStart,
  fetchFeeStructureSuccess,
  fetchFeeStructureFailure,
} from './feeStructureSlice';

export const fetchFeeStructureByClass = (classId) => async (dispatch) => {
  dispatch(fetchFeeStructureStart());
  try {
    const response = await axios.get(`/feeStructure/${classId}`);
    dispatch(fetchFeeStructureSuccess(response.data));
  } catch (error) {
    dispatch(fetchFeeStructureFailure(error.message));
  }
};
