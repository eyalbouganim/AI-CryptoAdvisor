import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Paper,
  CircularProgress,
  Button,
  Alert,
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';


// Component to display AI generated insights
const InsightAI = ({ votingButtons }) => {
  const [insight, setInsight] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchInsight = async () => {
    setLoading(true);
    setError('');
    // Don't clear insight immediately to preserve voting content

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Authentication token not found. Please log in again.');
      setLoading(false);
      return;
    }

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
      const response = await fetch(`${API_URL}/api/external/insight-ai`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch AI insight.');
      }

      setInsight(data.insight);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsight();
  }, []);

  return (
    <Paper elevation={3} sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2, height: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AutoAwesomeIcon color="primary" />
          <Typography variant="h6">Your AI Insight</Typography>
        </Box>
        {votingButtons && votingButtons(insight || '')}
      </Box>
      
      {loading && <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}><CircularProgress /></Box>}
      
      {error && <Alert severity="error">{error}</Alert>}
      
      {insight && <Typography variant="body1" sx={{ fontStyle: 'italic', flexGrow: 1 }}>"{insight}"</Typography>}

      <Button variant="outlined" onClick={fetchInsight} disabled={loading}>
        {loading ? 'Generating...' : 'Get New Insight'}
      </Button>
    </Paper>
  );
};

export default InsightAI;