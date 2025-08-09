import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFeeStructureByClass } from '../../redux/feeStructureRelated/feeStructureHandle';

const FeeCollectionPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { feeStructure, loading, error } = useSelector(state => state.feeStructure);

  const [students, setStudents] = useState([]);
  const [studentsLoading, setStudentsLoading] = useState(true);

  useEffect(() => {
    dispatch(fetchFeeStructureByClass(id));
  }, [dispatch, id]);

  useEffect(() => {
    // Fetch students in the class with fee payment status
    const fetchStudents = async () => {
      try {
        const studentsRes = await fetch(`/api/classes/${id}/students`);
        const studentsData = await studentsRes.json();
        setStudents(studentsData);
        setStudentsLoading(false);
      } catch (error) {
        console.error('Error fetching students data:', error);
        setStudentsLoading(false);
      }
    };
    fetchStudents();
  }, [id]);

  if (loading || studentsLoading) {
    return (
      <Container sx={{ mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography variant="h6" color="error">
          Error loading fee structure: {error}
        </Typography>
      </Container>
    );
  }

  if (!feeStructure) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography variant="h6" color="error">
          Fee structure not found.
        </Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Fee Collection for {feeStructure.sclassName}
      </Typography>
      <Typography variant="h6" gutterBottom>
        Total Fee: KSH {feeStructure.totalFee}
      </Typography>
      <Typography variant="h6" gutterBottom>
        Fee Details:
      </Typography>
      <ul>
        {feeStructure.feeDetails && feeStructure.feeDetails.map((fee, index) => (
          <li key={index}>
            {fee.description}: KSH {fee.amount}
          </li>
        ))}
      </ul>

      <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
        Students Fee Payment Status
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Student Name</TableCell>
              <TableCell>Fee Paid</TableCell>
              <TableCell>Fee Pending</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  No students found.
                </TableCell>
              </TableRow>
            ) : (
              students.map((student) => (
                <TableRow key={student._id}>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>KSH {student.feePaid || 0}</TableCell>
                  <TableCell>KSH {(feeStructure.totalFee - (student.feePaid || 0))}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default FeeCollectionPage;
