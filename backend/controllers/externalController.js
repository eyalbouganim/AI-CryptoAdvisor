const getMarketNews = async (req, res) => {
    // Getting the API key
    const apiKey = process.env.CRYPTOPANIC_API_KEY;

    // In case there's no API key
    if (!apiKey) {
        console.error('CryptoPanic API key is missing');
        return res.status(500).json({ message: 'Server configuration error' });
    }

    const apiUrl = 'https://cryptopanic.com/api/developer/v2/posts/';

    const urlParams = new URLSearchParams({
        auth_token: apiKey,
        kind: 'news',
        public: 'true'
    });

    const fullUrl = `${apiUrl}?${urlParams.toString()}`;

    try {
        const apiResponse = await fetch(fullUrl);
        if (!apiResponse.ok) {
            throw new Error(`CryptoPanic API responded with status: ${apiResponse.status}`);
        }
        const newsData = await apiResponse.json();
        res.json(newsData);
    } catch (error) {
        console.error('Error fetching market news:', error);
        res.status(500).json({ message: 'Failed to fetch market news' });
    }
}

const getCoinPrices = async (req, res) => {
    const apiKey = process.env.COINGECKO_API_KEY;

    if (!apiKey) {
        console.error('CoinGecko API key is missing');
        return res.status(500).json({ message: 'Server configuration error' });
    }

    // Extract user's interested assets
    const { assetsInterest } = req.user.userPreferences;

    if (!assetsInterest || assetsInterest.length === 0) {
        return res.status(400).json({ message: 'No assets of interest found for the user.' });
    }

    // Join the array of coin IDs into a comma-separated string for the API.
    const coinIds = assetsInterest.join(',');

    const apiUrl = new URL('https://api.coingecko.com/api/v3/simple/price');
    apiUrl.searchParams.append('ids', coinIds);
    apiUrl.searchParams.append('vs_currencies', 'usd');

    try {
        const apiResponse = await fetch(apiUrl.toString(), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-cg-demo-api-key': apiKey,
            },
        });

        if (!apiResponse.ok) {
            console.error('CoinGecko API Error Response:', await apiResponse.text());
            throw new Error(`CoinGecko API responded with status: ${apiResponse.status}`);
        }
        const pricesData = await apiResponse.json();
        res.json(pricesData);
    } catch (error) {
        console.error('Error fetching coin prices:', error);
        res.status(500).json({ message: 'Failed to fetch coin prices' });
    }
}

const getInsightAI = async (req, res) => {
    const openRouterApiKey = process.env.OPENROUTER_API_KEY;

    // Ensure user exists and has preferences
    if (!req.user || !req.user.userPreferences) {
        return res.status(400).json({ message: 'User data not found.' });
    }

    if (!openRouterApiKey) {
        console.error('An API key is missing for AI insights.');
        return res.status(500).json({ message: 'Server configuration error.' });
    }

    try {
        const { assetsInterest } = req.user.userPreferences;
        
        // Handle case where assetsInterest exists but is empty array
        if (!assetsInterest || assetsInterest.length === 0) {
            return res.status(400).json({ message: 'No assets of interest found.' });
        }
        
        const coinIds = assetsInterest.join(', ');
        
        const prompt = `As an expert crypto advisor, provide a brief, insightful market commentary about the following assets: ${coinIds}. What is one key takeaway for someone interested in these assets right now? Keep it under 50 words.`;

        // Use OpenRouter API to get AI-generated insight
        const aiResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${openRouterApiKey}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "http://localhost:3000",
                "X-Title": "Moveo Project",              
            },
            body: JSON.stringify({
                "model": "openai/gpt-oss-20b:free", 
                "messages": [
                    { "role": "user", "content": prompt }
                ],
            })
        });

        if (!aiResponse.ok) {
            const errorText = await aiResponse.text(); // Get the actual error message
            console.error('OpenRouter API Error:', aiResponse.status, errorText);
            throw new Error(`OpenRouter failed: ${aiResponse.status}`);
        }

        const aiData = await aiResponse.json();
        const insight = aiData.choices[0]?.message?.content || "No insight available.";

        res.json({ insight });

    } catch (error) {
        console.error('Error in getInsightAI:', error.message);
        res.status(500).json({ message: 'Failed to generate AI insight.' });
    }
}


const getCryptoMeme = async (req, res) => {
  try {
    // Fetches a random meme from CryptoCurrencyMemes
    const apiResponse = await fetch("https://meme-api.com/gimme/CryptoCurrencyMemes");
    const data = await apiResponse.json();

    if (!apiResponse.ok || data.nsfw) {
      return res.status(502).json({ message: 'Could not fetch a suitable meme.' });
    }

    res.json({ url: data.url, title: data.title });
  } catch (error) {
    console.error("Failed to fetch meme:", error);
    res.status(500).json({ message: 'Failed to fetch meme from external API.' });
  }
};

module.exports = {
    getMarketNews,
    getCoinPrices,
    getInsightAI,
    getCryptoMeme
}