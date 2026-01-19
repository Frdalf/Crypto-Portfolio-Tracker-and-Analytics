// Price Service - CoinGecko API
import { API_ENDPOINTS } from '../config/api';

// Token ID mapping for CoinGecko
const TOKEN_ID_MAP = {
  'ETH': 'ethereum',
  'MATIC': 'matic-network',
  'BNB': 'binancecoin',
  'USDC': 'usd-coin',
  'USDT': 'tether',
  'DAI': 'dai',
  'WETH': 'weth',
  'WBTC': 'wrapped-bitcoin',
  'LINK': 'chainlink',
  'UNI': 'uniswap',
  'AAVE': 'aave',
  'CRV': 'curve-dao-token',
  'SUSHI': 'sushi',
  'COMP': 'compound-governance-token',
  'MKR': 'maker',
  'SNX': 'havven',
  'YFI': 'yearn-finance',
  'SHIB': 'shiba-inu',
  'APE': 'apecoin',
  'LDO': 'lido-dao',
};

/**
 * Get prices for multiple tokens
 */
export const getTokenPrices = async (symbols) => {
  const ids = symbols
    .map(symbol => TOKEN_ID_MAP[symbol.toUpperCase()])
    .filter(Boolean)
    .join(',');

  if (!ids) {
    return {};
  }

  try {
    const response = await fetch(
      `${API_ENDPOINTS.COINGECKO}/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true&include_market_cap=true`
    );

    const data = await response.json();
    
    // Map back to symbols
    const prices = {};
    symbols.forEach(symbol => {
      const id = TOKEN_ID_MAP[symbol.toUpperCase()];
      if (id && data[id]) {
        prices[symbol.toUpperCase()] = {
          price: data[id].usd,
          change24h: data[id].usd_24h_change,
          marketCap: data[id].usd_market_cap,
        };
      }
    });

    return prices;
  } catch (error) {
    console.error('Failed to fetch prices:', error);
    return {};
  }
};

/**
 * Get single token price
 */
export const getTokenPrice = async (symbol) => {
  const prices = await getTokenPrices([symbol]);
  return prices[symbol.toUpperCase()] || null;
};

/**
 * Get top cryptocurrencies
 */
export const getTopCryptos = async (limit = 100) => {
  try {
    const response = await fetch(
      `${API_ENDPOINTS.COINGECKO}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false&price_change_percentage=24h`
    );

    const data = await response.json();
    
    return data.map(coin => ({
      id: coin.id,
      symbol: coin.symbol.toUpperCase(),
      name: coin.name,
      price: coin.current_price,
      change24h: coin.price_change_percentage_24h,
      marketCap: coin.market_cap,
      volume: coin.total_volume,
      image: coin.image,
    }));
  } catch (error) {
    console.error('Failed to fetch top cryptos:', error);
    return [];
  }
};

/**
 * Get price history for charts
 */
export const getPriceHistory = async (coinId, days = 7) => {
  try {
    const response = await fetch(
      `${API_ENDPOINTS.COINGECKO}/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`
    );

    const data = await response.json();
    
    return data.prices.map(([timestamp, price]) => ({
      timestamp: new Date(timestamp),
      price,
    }));
  } catch (error) {
    console.error('Failed to fetch price history:', error);
    return [];
  }
};

/**
 * Search for tokens
 */
export const searchTokens = async (query) => {
  try {
    const response = await fetch(
      `${API_ENDPOINTS.COINGECKO}/search?query=${encodeURIComponent(query)}`
    );

    const data = await response.json();
    
    return data.coins.slice(0, 10).map(coin => ({
      id: coin.id,
      symbol: coin.symbol.toUpperCase(),
      name: coin.name,
      thumb: coin.thumb,
      marketCapRank: coin.market_cap_rank,
    }));
  } catch (error) {
    console.error('Failed to search tokens:', error);
    return [];
  }
};
