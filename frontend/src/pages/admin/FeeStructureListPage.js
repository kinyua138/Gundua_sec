import React, { useEffect, useState } from 'react';
import { Container, Typography, List, ListItem, ListItemText, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';

const FeeStructureListPage = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await fetch('/api/classes');
        const data = await res.json();
        setClasses(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching classes:', error);
        setLoading(false);
      }
    };
    fetchClasses();
  }, []);

  if (loading) {
    return (
      <Container sx={{ mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Fee Structures - Classes
      </Typography>
      <List>
        {classes.length === 0 ? (
          <Typography>No classes found.</Typography>
        ) : (
          classes.map((cls) => (
            <ListItem button component={Link} to={`/Admin/feeStructure/${cls._id}`} key={cls._id}>
              <ListItemText primary={cls.sclassName} />
            </ListItem>
          ))
        )}
      </List>
    </Container>
  );
};

export default FeeStructureListPage;
