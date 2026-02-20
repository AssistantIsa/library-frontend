import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Button, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Alert, Box, IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { booksAPI } from '../../services/api';

const ManageBooks = () => {
  const [books, setBooks] = useState([]);
  const [open, setOpen] = useState(false);
  const [editBook, setEditBook] = useState(null);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    isbn: '', title: '', author: '',
    publisher: '', publication_year: '',
    total_copies: 1, description: ''
  });

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    const response = await booksAPI.getAll({});
    setBooks(response.data.books);
  };

  const handleOpen = (book = null) => {
    if (book) {
      setEditBook(book);
      setFormData(book);
    } else {
      setEditBook(null);
      setFormData({
        isbn: '', title: '', author: '',
        publisher: '', publication_year: '',
        total_copies: 1, description: ''
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditBook(null);
  };

  const handleSubmit = async () => {
    try {
      if (editBook) {
        await booksAPI.update(editBook.id, formData);
        setMessage('✅ Book updated successfully!');
      } else {
        await booksAPI.create(formData);
        setMessage('✅ Book created successfully!');
      }
      fetchBooks();
      handleClose();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(`❌ ${err.response?.data?.message || 'Error saving book'}`);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleDelete = async (bookId) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await booksAPI.delete(bookId);
        setMessage('✅ Book deleted successfully!');
        fetchBooks();
        setTimeout(() => setMessage(''), 3000);
      } catch (err) {
        setMessage('❌ Error deleting book');
        setTimeout(() => setMessage(''), 3000);
      }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="space-between" mb={3}>
        <Typography variant="h4">📚 Manage Books</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          Add Book
        </Button>
      </Box>

      {message && (
        <Alert
          severity={message.startsWith('✅') ? 'success' : 'error'}
          sx={{ mb: 2 }}
        >
          {message}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>ISBN</strong></TableCell>
              <TableCell><strong>Title</strong></TableCell>
              <TableCell><strong>Author</strong></TableCell>
              <TableCell><strong>Copies</strong></TableCell>
              <TableCell><strong>Available</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {books.map((book) => (
              <TableRow key={book.id}>
                <TableCell>{book.isbn}</TableCell>
                <TableCell>{book.title}</TableCell>
                <TableCell>{book.author}</TableCell>
                <TableCell>{book.total_copies}</TableCell>
                <TableCell>{book.available_copies}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(book)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(book.id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog para crear/editar */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editBook ? '✏️ Edit Book' : '➕ Add New Book'}
        </DialogTitle>
        <DialogContent>
          {['isbn', 'title', 'author', 'publisher'].map((field) => (
            <TextField
              key={field}
              fullWidth
              label={field.charAt(0).toUpperCase() + field.slice(1)}
              margin="normal"
              value={formData[field] || ''}
              onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
              required={['isbn', 'title', 'author'].includes(field)}
            />
          ))}
          <TextField
            fullWidth
            label="Publication Year"
            type="number"
            margin="normal"
            value={formData.publication_year || ''}
            onChange={(e) => setFormData({ ...formData, publication_year: e.target.value })}
          />
          <TextField
            fullWidth
            label="Total Copies"
            type="number"
            margin="normal"
            value={formData.total_copies || 1}
            onChange={(e) => setFormData({ ...formData, total_copies: parseInt(e.target.value) })}
          />
          <TextField
            fullWidth
            label="Description"
            multiline
            rows={3}
            margin="normal"
            value={formData.description || ''}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editBook ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ManageBooks;
