import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Button,
  Chip, Alert, CircularProgress, Box
} from '@mui/material';
import { loansAPI } from '../../services/api';

const MyLoans = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      setLoading(true);
      const response = await loansAPI.getMyLoans();
      setLoans(response.data);
    } catch (err) {
      setError('Error loading loans');
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (loanId) => {
    try {
      await loansAPI.returnBook(loanId);
      setMessage('✅ Book returned successfully!');
      fetchLoans();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(`❌ ${err.response?.data?.message || 'Error returning book'}`);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'primary';
      case 'returned': return 'success';
      case 'overdue': return 'error';
      default: return 'default';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isOverdue = (loan) => {
    return loan.status === 'active' && new Date() > new Date(loan.due_date);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        📖 My Loans
      </Typography>

      {message && (
        <Alert
          severity={message.startsWith('✅') ? 'success' : 'error'}
          sx={{ mb: 2 }}
        >
          {message}
        </Alert>
      )}

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : loans.length === 0 ? (
        <Alert severity="info">You have no loans yet</Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Book ID</strong></TableCell>
                <TableCell><strong>Loan Date</strong></TableCell>
                <TableCell><strong>Due Date</strong></TableCell>
                <TableCell><strong>Return Date</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell><strong>Fine</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loans.map((loan) => (
                <TableRow
                  key={loan.id}
                  sx={{ backgroundColor: isOverdue(loan) ? '#fff3e0' : 'inherit' }}
                >
                  <TableCell>{loan.book_id}</TableCell>
                  <TableCell>{formatDate(loan.loan_date)}</TableCell>
                  <TableCell>
                    {formatDate(loan.due_date)}
                    {isOverdue(loan) && (
                      <Chip label="OVERDUE" color="error" size="small" sx={{ ml: 1 }} />
                    )}
                  </TableCell>
                  <TableCell>
                    {loan.return_date ? formatDate(loan.return_date) : '-'}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={loan.status.toUpperCase()}
                      color={getStatusColor(loan.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {loan.fine_amount > 0 ? (
                      <Typography color="error">${loan.fine_amount.toFixed(2)}</Typography>
                    ) : '-'}
                  </TableCell>
                  <TableCell>
                    {loan.status === 'active' && (
                      <Button
                        size="small"
                        variant="outlined"
                        color="secondary"
                        onClick={() => handleReturn(loan.id)}
                      >
                        Return
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default MyLoans;
