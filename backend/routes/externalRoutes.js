const express = require('express')
const router = express.Router();
const { getMarketNews, getCoinPrices, getInsightAI, getCryptoMeme } = require('../controllers/externalController')
const { protect } = require('../middleware/authMiddleware');

router.get('/marketnews', protect, getMarketNews)

router.get('/coinprices', protect, getCoinPrices)

router.post('/insight-ai', protect, getInsightAI)

router.get('/crypto-meme', protect, getCryptoMeme)

module.exports = router;