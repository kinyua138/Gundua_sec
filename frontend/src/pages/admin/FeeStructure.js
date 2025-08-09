import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchFeeStructureByClass } from '../../redux/feeStructureRelated/feeStructureHandle';
import { useParams } from 'react-router-dom';
import { Container, Typography, Table, TableBody, TableCell, TableHead, TableRow, Paper } from '@mui/material';

const FeeStructure = () => {
  const { classId } = useParams();
  const dispatch = useDispatch();
  const feeStructure = useSelector(state => state.feeStructure.feeStructure);
  const loading = useSelector(state => state.feeStructure.loading);
  const error = useSelector(state => state.feeStructure.error);

  useEffect(() => {
    if (classId) {
      dispatch(fetchFeeStructureByClass(classId));
    }
  }, [classId, dispatch]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!feeStructure) return <div>No fee structure found for this class.</div>;

  const totalPaid = feeStructure.payments.reduce((acc, payment) => acc + payment.amountPaid, 0);
  const balance = feeStructure.totalFee - totalPaid;

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Fee Structure for Class: {feeStructure.classId.name || feeStructure.classId._id}
      </Typography>
      <Paper>
        <Typography variant="h6" gutterBottom>Fee Details</Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Description</TableCell>
              <TableCell>Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {feeStructure.feeDetails.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.description}</TableCell>
                <TableCell>{item.amount}</TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell><strong>Total Fee</strong></TableCell>
              <TableCell><strong>{feeStructure.totalFee}</strong></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Paper>
      <Paper style={{ marginTop: 20 }}>
        <Typography variant="h6" gutterBottom>Payments</Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Student</TableCell>
              <TableCell>Amount Paid</TableCell>
              <TableCell>Payment Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {feeStructure.payments.map((payment, index) => (
              <TableRow key={index}>
                <TableCell>{payment.studentId?.name || payment.studentId?._id}</TableCell>
                <TableCell>{payment.amountPaid}</TableCell>
                <TableCell>{new Date(payment.paymentDate).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Typography variant="h6" style={{ marginTop: 10 }}>
          Total Balance Fees: {balance}
        </Typography>
      </Paper>
    </Container>
  );
};

export default FeeStructure;
