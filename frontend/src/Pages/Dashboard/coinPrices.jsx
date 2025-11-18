import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Divider,
  ListItemIcon,
} from '@mui/material';
import ShowChartIcon from "@mui/icons-material/ShowChart";

// Component to display coin prices according to user preferences
const CoinPrices = ({ votingButtons }) => {
  const [prices, setPrices] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCoinPrices = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication token not found. Please log in again.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/external/coinprices', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch coin prices.');
        }

        setPrices(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCoinPrices();
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  return (
    <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="h6">
          Your Coin Prices
        </Typography>
        {votingButtons && votingButtons(prices || {})}
      </Box>
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80%' }}>
          <CircularProgress />
        </Box>
      )}
      {error && <Typography color="error">{error}</Typography>}
      {!loading && !error && prices && (
        <List>
          {Object.entries(prices).map(([coin, priceData], index) => (
            <React.Fragment key={coin}>
              <ListItem>
                <ListItemIcon>
                  <ShowChartIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary={coin.charAt(0).toUpperCase() + coin.slice(1)} secondary={formatPrice(priceData.usd)} />
              </ListItem>
              {index < Object.keys(prices).length - 1 && <Divider variant="inset" component="li" />}
            </React.Fragment>
          ))}
        </List>
      )}
    </Paper>
  );
};

export default CoinPrices;