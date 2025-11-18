const externalApiService = require('../services/externalApiService');

// Controller to handle fetching market news
const getMarketNews = async (req, res) => {
    try {
        const newsData = await externalApiService.fetchMarketNews(req.user.userPreferences);
        res.json(newsData);
    } catch (error) {
        if (error.message.includes('429')) {
            console.error('Rate limit exceeded for market news service:', error.message);
            return res.status(429).json({ message: 'Rate limit exceeded. Please try again later.' });
        }
        console.error('Error fetching market news:', error);
        res.status(500).json({ message: 'Failed to fetch market news' });
    }
}

// Controller to handle fetching coin prices
const getCoinPrices = async (req, res) => {
    try {
        const pricesData = await externalApiService.fetchCoinPrices(req.user.userPreferences);
        res.json(pricesData);
    } catch (error) {
        console.error('Error fetching coin prices:', error);
        res.status(500).json({ message: 'Failed to fetch coin prices' });
    }
};


// Controller to handle generating AI insights
const getInsightAI = async (req, res) => {
    try {
        const insight = await externalApiService.fetchAIInsight(req.user.userPreferences);
        res.json({ insight });
    } catch (error) {
        if (error.message.includes('429')) {
            console.error('Rate limit exceeded for AI service:', error.message);
            return res.status(429).json({ message: 'Rate limit exceeded. Please try again later.' });
        }
        console.error('Error in getInsightAI:', error.message);
        res.status(500).json({ message: 'Failed to generate AI insight.' });
    }
};


// Controller to handle fetching crypto memes
const getCryptoMeme = async (req, res) => {
    try {
        const memeData = await externalApiService.fetchCryptoMeme(req.user.userPreferences);
        res.json(memeData);
    } catch (error) {
        console.error("Failed to fetch meme:", error);
        res.status(500).json({ message: "Failed to fetch meme from external API." });
    }
};

module.exports = {
    getMarketNews,
    getCoinPrices,
    getInsightAI,
    getCryptoMeme
}