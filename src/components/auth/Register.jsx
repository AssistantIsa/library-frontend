import React, { useState } from 'react';
import { Container, Paper, TextField, Button, Typography, Alert, MenuItem } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'member'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const result = await register(formData);
    if (result.success) {
      setSuccess('Account created! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } else {
      setError(result.error);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>📚 Register</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField fullWidth label="Username" name="username" margin="normal" value={formData.username} onChange={handleChange} required />
          <TextField fullWidth label="Email" name="email" type="email" margin="normal" value={formData.email} onChange={handleChange} required />
          <TextField fullWidth label="Password" name="password" type="password" margin="normal" value={formData.password} onChange={handleChange} required />
          <TextField fullWidth select label="Role" name="role" margin="normal" value={formData.role} onChange={handleChange}>
            <MenuItem value="member">Member</MenuItem>
            <MenuItem value="librarian">Librarian</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </TextField>
          <Button fullWidth variant="contained" type="submit" disabled={loading} sx={{ mt: 2 }}>{loading ? 'Registering...' : 'Register'}</Button>
          <Typography align="center" sx={{ mt: 2 }}>Already have an account? <Link to="/login">Login</Link></Typography>
        </form>
      </Paper>
    </Container>
  );
};

export default Register;
