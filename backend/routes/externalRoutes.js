const express = require('express')
const router = express.Router();
const { getMarketNews, getCoinPrices, getInsightAI, getCryptoMeme } = require('../controllers/externalController')
const { protect } = require('../middleware/authMiddleware');

// Route to fetch market news
router.get('/marketnews', protect, getMarketNews)

// Route to fetch coin prices
router.get('/coinprices', protect, getCoinPrices)

// Route to generate AI insights
router.post('/insight-ai', protect, getInsightAI)

// Route to fetch crypto memes
router.get('/crypto-meme', protect, getCryptoMeme)

module.exports = router;