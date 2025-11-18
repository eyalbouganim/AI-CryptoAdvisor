const express = require('express')
const router = express.Router();
const { getMarketNews, getCoinPrices, getInsightAI, getCryptoMeme } = require('../controllers/externalController')

router.get('/marketnews', getMarketNews)

router.get('/coinprices', getCoinPrices)

router.get('/insight-ai', getInsightAI)

router.get('/crypto-meme', getCryptoMeme)

module.exports = router;