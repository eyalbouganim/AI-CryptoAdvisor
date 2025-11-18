import React, { useState, useEffect, useMemo } from 'react';
import CoinPrices from './coinPrices.jsx';
import MarketNews from './marketNews.jsx';
import InsightAI from './insightAI.jsx';
import FunCryptoMeme from './funCryptoMeme.jsx';
import TopMenu from './topMenu';
import withVoting from './withVoting';
import {
  Container,
  Grid,
  Box,
} from '@mui/material';

// Dashboard component: displays various sections based on user preferences

// Apply the withVoting HOC to each component that needs voting functionality
const CoinPricesWithVoting = withVoting(CoinPrices, 'CoinPrices');
const InsightAIWithVoting = withVoting(InsightAI, 'InsightAI');
const MarketNewsWithVoting = withVoting(MarketNews, 'MarketNews');
const FunCryptoMemeWithVoting = withVoting(FunCryptoMeme, 'FunCryptoMeme');

const componentMap = {
  'Charts': { Component: CoinPricesWithVoting, name: 'Charts' },
  'Market News': { Component: MarketNewsWithVoting, name: 'Market News' },
  'Social': { Component: InsightAIWithVoting, name: 'Social' },
  'Fun': { Component: FunCryptoMemeWithVoting, name: 'Fun' },
};

const Dashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Retrieve the user object from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse user data from localStorage", error);
      }
    }
  }, []);

  // Memoize the sorted components based on user preferences
  const sortedComponents = useMemo(() => {
    const allComponentKeys = ['Charts', 'Market News', 'Social', 'Fun'];
    const preferences = user?.userPreferences?.contentPreferences || [];

    if (!preferences.length) {
      return allComponentKeys.map(key => ({ ...componentMap[key], isPreferred: false }));
    }

    // Separate preferred and non-preferred components
    const preferred = [];
    const nonPreferred = [];

    allComponentKeys.forEach(key => {
      if (preferences.includes(key)) {
        preferred.push({ ...componentMap[key], isPreferred: true });
      } else {
        nonPreferred.push({ ...componentMap[key], isPreferred: false });
      }
    });

    // Return preferred first, then non preferred
    return [...preferred, ...nonPreferred];
  }, [user]);

  return (
    <Box sx={{ flexGrow: 1, bgcolor: '#f5f5f5', minHeight: '100vh', pb: 4 }}>
      <TopMenu />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Grid container spacing={3}>
          {sortedComponents.map(({ Component, name }, index) => {
            // The first item is large, the rest are smaller.
            const size = index === 0 ? 8 : 4;
            return <Grid item xs={12} md={size} key={name}><Component /></Grid>;
          })}
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard;