import React, { useState, useEffect } from 'react';
import { Container, Grid, Card, CardContent, CardActions, Typography, Button, TextField, Box, Chip, CircularProgress, Alert, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { booksAPI, loansAPI } from '../../services/api';
import { getUserRole } from '../../utils/auth';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');
  const role = getUserRole();

  useEffect(() => { fetchBooks(); }, [search]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const res = await booksAPI.getAll({ search });
      setBooks(res.data.books);
    } catch (err) {
      setError('Error loading books');
    } finally {
      setLoading(false);
    }
  };

  const handleBorrow = async (bookId) => {
    try {
      await loansAPI.create({ book_id: bookId });
      setMessage('✅ Book borrowed!');
      fetchBooks();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(`❌ ${err.response?.data?.message || 'Error'}`);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>📚 Library Catalog</Typography>
      {message && <Alert severity={message.includes('✅') ? 'success' : 'error'} sx={{ mb: 2 }}>{message}</Alert>}
      <Box sx={{ mb: 3 }}>
        <TextField fullWidth placeholder="Search by title, author or ISBN..." value={search} onChange={(e) => setSearch(e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }} />
      </Box>
      {loading ? <CircularProgress /> : error ? <Alert severity="error">{error}</Alert> : (
        <Grid container spacing={3}>
          {books.map(book => (
            <Grid item xs={12} sm={6} md={4} key={book.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" noWrap>{book.title}</Typography>
                  <Typography color="text.secondary">{book.author}</Typography>
                  <Typography variant="body2">ISBN: {book.isbn}</Typography>
                  {book.publisher && <Typography variant="body2">Publisher: {book.publisher}</Typography>}
                  <Box mt={1}>
                    <Chip label={`${book.available_copies}/${book.total_copies} available`} color={book.available_copies > 0 ? 'success' : 'error'} size="small" />
                  </Box>
                </CardContent>
                {role === 'member' && (
                  <CardActions>
                    <Button size="small" variant="contained" disabled={book.available_copies === 0} onClick={() => handleBorrow(book.id)} fullWidth>
                      {book.available_copies > 0 ? 'Borrow' : 'Not Available'}
                    </Button>
                  </CardActions>
                )}
              </Card>
            </Grid>
          ))}
          {books.length === 0 && <Grid item xs={12}><Alert severity="info">No books found</Alert></Grid>}
        </Grid>
      )}
    </Container>
  );
};

export default BookList;
