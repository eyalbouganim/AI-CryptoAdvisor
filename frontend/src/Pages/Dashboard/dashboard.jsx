import React from 'react';
import CoinPrices from './coinPrices.jsx'
import MarketNews from './marketNews.jsx';
import InsightAI from './insightAI.jsx';
import FunCryptoMeme from './funCryptoMeme.jsx';
import TopMenu from './topMenu.jsx';
import {
  Container,
  Grid,
  Box,
} from '@mui/material';

const Dashboard = () => {
  return (
    <Box sx={{ flexGrow: 1, bgcolor: '#f5f5f5', minHeight: '100vh', pb: 4 }}>
      <TopMenu />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Grid container spacing={3}>
          {/* Top Row: Coin Prices (Large) and AI Insight (Small) */}
          <Grid item xs={12} md={8}>
            <CoinPrices />
          </Grid>
          <Grid item xs={12} md={4}>
            <InsightAI />
          </Grid>

          {/* Bottom Row: Market News and Meme */}
          <Grid item xs={12} md={8}>
            <MarketNews />
          </Grid>
          <Grid item xs={12} md={4}>
            <FunCryptoMeme />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard;