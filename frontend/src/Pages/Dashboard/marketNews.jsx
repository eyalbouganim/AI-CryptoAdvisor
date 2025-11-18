import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Link,
  Alert,
  Divider,
} from '@mui/material';

// Component to display market news
const MarketNews = ({ votingButtons }) => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNews = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication token not found. Please log in again.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/external/marketnews', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch market news.');
        }

        setNews(data.results || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="h6">
          Market News
        </Typography>
        {votingButtons && votingButtons(news.length > 0 ? news.map(n => n.title) : [])}
      </Box>
      {loading && <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80%' }}><CircularProgress /></Box>}
      {error && <Alert severity="error">{error}</Alert>}
      {!loading && !error && (
        <List sx={{ overflow: 'auto', maxHeight: 400 }}>
          {news.map((article, index) => (
            <React.Fragment key={article.id || index}>
              <ListItem alignItems="flex-start" component={Link} href={article.url} target="_blank" rel="noopener noreferrer" sx={{ textDecoration: 'none', color: 'inherit' }}>
                <ListItemText primary={article.title} secondary={`Source: ${article.source?.domain || 'N/A'}`} />
              </ListItem>
              {index < news.length - 1 && <Divider component="li" />}
            </React.Fragment>
          ))}
        </List>
      )}
    </Paper>
  );
};

export default MarketNews;