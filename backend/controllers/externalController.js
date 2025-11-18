

const getMarketNews = async (req, res) => {
    // Getting the API key
    const apiKey = process.env.CRYPTOPANIC_API_KEY;

    // In case there's no API key
    if (!apiKey) {
        console.error('CryptoPanic API key is missing');
        return res.status(500).json({ message: 'Server configuration error' });
    }

    apiUrl = 'https://cryptopanic.com/api/developer/v2/posts'

    const urlParams = new URLSearchParams({
    auth_token: apiKey,
    kind: 'news',
    public: 'true'
    });

    const fullUrl = `${apiUrl}?${urlParams.toString()}`;


}

const getCoinPrices = async (req, res) => {

}

const getInsightAI = async (req, res) => {

}

const getCryptoMeme = async (req, res) => {

}

module.exports = {
    getMarketNews,
    getCoinPrices,
    getInsightAI,
    getCryptoMeme
}