// Function to fetch market news from CryptoPanic API
const fetchMarketNews = async ({ assetsInterest, investorType }) => {
    const apiKey = process.env.CRYPTOPANIC_API_KEY;
    if (!apiKey) throw new Error('CryptoPanic API key is missing');

    const assetCodes = { Bitcoin: "BTC", Ethereum: "ETH", Altcoins: "SOL", DeFi: "UNI", NFTs: "AXS" };
    const currencySymbols = assetsInterest.map(name => assetCodes[name]).filter(Boolean);

    const urlParams = new URLSearchParams({ auth_token: apiKey, kind: 'news', public: 'false' });

    let filters = [];
    // Add filters based on investor type
    // Day Traders will probably want hot and rising news
    if (investorType === 'Day Trader') filters.push('hot', 'rising');
    // HODLers might prefer important and bullish news
    else if (investorType === 'HODLer') filters.push('important', 'bullish', 'saved');
    // NFT Collectors might be interested in important and hot news
    else if (investorType === 'NFT Collector') filters.push('important', 'hot');

    if (filters.length > 0) urlParams.append('filter', filters.join(','));
    if (currencySymbols.length > 0) urlParams.append('currencies', currencySymbols.join(','));

    const response = await fetch(`https://cryptopanic.com/api/developer/v2/posts/?${urlParams.toString()}`);
    if (!response.ok) throw new Error(`CryptoPanic API responded with status: ${response.status}`);
    
    return await response.json();
};

// Function to fetch coin prices from CoinGecko API
const fetchCoinPrices = async ({ assetsInterest }) => {
    const apiKey = process.env.COINGECKO_API_KEY;
    if (!apiKey) throw new Error('CoinGecko API key is missing');

    const assetIdMapping = {
        'Bitcoin': 'bitcoin',
        'Ethereum': 'ethereum',
        'Altcoins': 'altcoin',
        'DeFi': 'my-defi-pet',
        'NFTs': '1million-nfts'
  };

    const coinIds = assetsInterest.map(name => assetIdMapping[name]).filter(Boolean).join(',');
    if (!coinIds) throw new Error('No valid assets of interest found for the user.');

    const apiUrl = new URL('https://api.coingecko.com/api/v3/simple/price');
    apiUrl.searchParams.append('ids', coinIds);
    apiUrl.searchParams.append('vs_currencies', 'usd');

    const response = await fetch(apiUrl.toString(), {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json',
        'x-cg-demo-api-key': apiKey,
        },
  });

    if (!response.ok) {
        console.error('CoinGecko API Error Response:', await response.text());
        throw new Error(`CoinGecko API responded with status: ${response.status}`);
    }

    return await response.json();
};

// Function to fetch AI-generated market insight from OpenRouter API
const fetchAIInsight = async ({ assetsInterest, investorType }) => {
  const openRouterApiKey = process.env.OPENROUTER_API_KEY;
  if (!openRouterApiKey) throw new Error('OpenRouter API key is missing');

  if (!assetsInterest || assetsInterest.length === 0) {
    throw new Error('No assets of interest found.');
  }

  const coinIds = assetsInterest.join(', ');
  const prompt = `As an expert crypto advisor, provide a brief market commentary about the following assets: ${coinIds}. The user identifies as a '${investorType}'. Give a tip tailored to this investor type. Must be less than 40 words.`;

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${openRouterApiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "http://localhost:3000",
      "X-Title": "Moveo Project",
    },
    body: JSON.stringify({
      "model": "openai/gpt-oss-20b:free",
      "messages": [{ "role": "user", "content": prompt }],
    }),
  });

  if (!response.ok) {
    console.error('OpenRouter API Error:', response.status, await response.text());
    throw new Error(`OpenRouter failed: ${response.status}`);
  }

  const aiData = await response.json();
  return aiData.choices[0]?.message?.content || "No insight available.";
};

// Function to fetch crypto meme from Meme API using subreddit mapping
const fetchCryptoMeme = async ({ assetsInterest, investorType }) => {
    const interestToSubreddits = {
        Bitcoin: ["BitcoinMemes", "CryptoCurrencyMemes"],
        Ethereum: ["EthereumMemes", "CryptoCurrencyMemes"],
        Altcoins: ["CryptoCurrencyMemes", "CryptoMoonShots"],
        DeFi: ["CryptoCurrencyMemes", "ethtrader"],
        NFTs: ["NFTsMarketplace", "NFTmemes"],
        "NFT-Collector": ["NFTMemes"],
        "Day Trader": ["wallstreetbets", "CryptoCurrencyMemes"],
        "HODLer": ["Bitcoin", "CryptoCurrencyMemes"],
    };

    let results = [];
    if (Array.isArray(assetsInterest)) {
        for (const item of assetsInterest) {
        if (interestToSubreddits[item]) results.push(...interestToSubreddits[item]);
        }
    }
    if (investorType && interestToSubreddits[investorType]) {
        results.push(...interestToSubreddits[investorType]);
    }

    const subreddits = results.length > 0 ? results : ["CryptoCurrencyMemes"];
    const chosen = subreddits[Math.floor(Math.random() * subreddits.length)];

    const response = await fetch(`https://meme-api.com/gimme/${chosen}`);
    const data = await response.json();

    if (!response.ok || data.nsfw) {
        throw new Error('Could not fetch a suitable meme.');
    }

    return {
        url: data.url,
        title: data.title,
        subreddit: chosen,
    };
};

module.exports = {
  fetchMarketNews,
  fetchCoinPrices,
  fetchAIInsight,
  fetchCryptoMeme,
};