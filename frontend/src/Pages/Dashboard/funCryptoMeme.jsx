import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Paper,
  CircularProgress,
  Button,
  Alert,
} from '@mui/material';
import MoodIcon from '@mui/icons-material/Mood';

// Component to display a random crypto meme based on user preferences
const FunCryptoMeme = ({ votingButtons }) => {
  const [meme, setMeme] = useState({ url: '', title: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchMeme = async () => {
    setLoading(true);
    setError('');

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Authentication token not found.');
      setLoading(false);
      return;
    }

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
      const response = await fetch(`${API_URL}/api/external/crypto-meme`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch meme.');
      }

      setMeme({ url: data.url, title: data.title });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeme();
  }, []);

  return (
    <Paper elevation={3} sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2, height: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <MoodIcon color="secondary" />
          <Typography variant="h6">A Little Fun</Typography>
        </Box>
        {votingButtons && votingButtons(meme)}
      </Box>

      <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 250 }}>
        {loading && <CircularProgress />}
        {error && <Alert severity="error" sx={{ width: '100%' }}>{error}</Alert>}
        {!loading && !error && meme.url && (
          <Box
            component="img"
            src={meme.url}
            alt={meme.title || 'Crypto Meme'}
            sx={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: 1 }}
          />
        )}
      </Box>

      <Button variant="contained" color="secondary" onClick={fetchMeme} disabled={loading}>
        {loading ? 'Loading...' : 'Another One!'}
      </Button>
    </Paper>
  );
};

export default FunCryptoMeme;