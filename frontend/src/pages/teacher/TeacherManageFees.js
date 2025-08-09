import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Typography, Table, TableBody, TableCell, TableHead, TableRow, TextField, Button, Paper } from '@mui/material';

const TeacherManageFees = () => {
  const { studentId } = useParams();
  const [feeData, setFeeData] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFeeData = async () => {
    try {
      const res = await axios.get(`/studentFeeBalance/${studentId}`);
      setFeeData(res.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch fee data');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeeData();
  }, [studentId]);

  const handlePayment = async () => {
    if (!paymentAmount || isNaN(paymentAmount) || paymentAmount <= 0) {
      alert('Please enter a valid payment amount');
      return;
    }
    try {
      await axios.post('/feeStructure/payment', {
        classId: feeData.classId,
        studentId,
        amountPaid: Number(paymentAmount),
      });
      setPaymentAmount('');
      fetchFeeData();
    } catch (err) {
      alert('Failed to process payment');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!feeData) return <div>No fee data found</div>;

  const balance = feeData.balance;

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Manage Fees for Student
        </Typography>
        <Typography>Total Fee: KSH {feeData.totalFee}</Typography>
        <Typography>Amount Paid: KSH {feeData.amountPaid}</Typography>
        <Typography>Balance: KSH {balance}</Typography>

        <TextField
          label="Payment Amount"
          type="number"
          value={paymentAmount}
          onChange={(e) => setPaymentAmount(e.target.value)}
          fullWidth
          sx={{ mt: 2 }}
        />
        <Button variant="contained" color="primary" onClick={handlePayment} sx={{ mt: 2 }}>
          Deduct Payment
        </Button>
      </Paper>
    </Container>
  );
};

export default TeacherManageFees;
