// Portfolio Service
// Integrates Etherscan and CoinGecko APIs

import { getEthBalance, getTokenBalances, getTokenBalancesBatch } from './etherscanService';
import { getTokenPrices } from './priceService';

// Token icons mapping
const TOKEN_ICONS = {
  'ETH': '💎',
  'MATIC': '🟣',
  'BNB': '🟡',
  'USDC': '💵',
  'USDT': '💵',
  'DAI': '💛',
  'WETH': '💎',
  'WBTC': '🟠',
  'LINK': '🔗',
  'UNI': '🦄',
  'AAVE': '👻',
  'DEFAULT': '🪙',
};

/**
 * Get full portfolio with real data
 * Optimized for faster loading with parallel processing and timeouts
 * @param {string} address - Wallet address
 * @param {string} chain - Blockchain network
 * @param {function} onStatus - Callback for status updates
 */
export const getPortfolio = async (address, chain = 'ethereum', onStatus = () => {}) => {
  const TIMEOUT_MS = 15000; // 15 second overall timeout
  
  onStatus('⏳ Starting portfolio fetch...');
  
  // Create a timeout promise
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Portfolio fetch timeout - try again')), TIMEOUT_MS);
  });

  try {
    // Race against timeout
    return await Promise.race([
      fetchPortfolioData(address, chain, onStatus),
      timeoutPromise
    ]);
  } catch (error) {
    console.error('Failed to fetch portfolio:', error);
    throw error;
  }
};

/**
 * Internal function to fetch portfolio data
 */
const fetchPortfolioData = async (address, chain, onStatus = () => {}) => {
  const portfolio = [];

  onStatus('🔍 Fetching native balance & token list...');
  
  // 1. Get native token balance and token list in parallel
  const [nativeBalance, tokens] = await Promise.all([
    getEthBalance(address, chain).catch((e) => {
      console.error('Native balance error:', e);
      return 0;
    }),
    getTokenBalances(address, chain).catch((e) => {
      console.error('Token list error:', e);
      return [];
    })
  ]);
  
  onStatus(`✅ Native balance: ${nativeBalance.toFixed(4)} | Found ${tokens.length} tokens`);
  
  const nativeSymbol = chain === 'polygon' ? 'MATIC' : chain === 'bsc' ? 'BNB' : 'ETH';
  
  if (nativeBalance > 0) {
    portfolio.push({
      symbol: nativeSymbol,
      name: nativeSymbol === 'ETH' ? 'Ethereum' : nativeSymbol === 'MATIC' ? 'Polygon' : 'BNB',
      balance: nativeBalance.toFixed(6),
      contractAddress: null,
      isNative: true,
    });
  }

  // 2. Get ERC-20 token balances in parallel batches (much faster!)
  const limitedTokens = tokens.slice(0, 10); // Limit to 10 tokens for faster loading
  
  if (limitedTokens.length > 0) {
    onStatus(`📊 Fetching balances for ${limitedTokens.length} tokens...`);
    
    const tokenBalances = await getTokenBalancesBatch(address, limitedTokens, chain);
    
    for (const token of tokenBalances) {
      if (token.balance > 0.0001) { // Filter dust
        portfolio.push({
          symbol: token.symbol,
          name: token.name,
          balance: token.balance.toFixed(6),
          contractAddress: token.contractAddress,
          isNative: false,
        });
      }
    }
    
    onStatus(`✅ Got ${portfolio.length - 1} token balances`);
  }

  // 3. Get prices for all tokens
  onStatus('💰 Fetching prices from CoinGecko...');
  const symbols = portfolio.map(t => t.symbol);
  const prices = await getTokenPrices(symbols).catch(() => ({}));
  
  onStatus(`✅ Got prices for ${Object.keys(prices).length} tokens`);

  // 4. Combine data
  const portfolioWithPrices = portfolio.map(token => {
    const priceData = prices[token.symbol.toUpperCase()] || { price: 0, change24h: 0 };
    const value = parseFloat(token.balance) * priceData.price;

    return {
      ...token,
      price: priceData.price,
      value: value,
      change24h: priceData.change24h || 0,
      icon: token.logo || TOKEN_ICONS[token.symbol.toUpperCase()] || TOKEN_ICONS.DEFAULT,
    };
  });

  onStatus('🎉 Portfolio loaded successfully!');
  
  // Sort by value (highest first)
  return portfolioWithPrices.sort((a, b) => b.value - a.value);
};

/**
 * Demo portfolio data (for testing without API)
 */
export const getDemoPortfolio = async (address) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  return [
    {
      symbol: 'ETH',
      name: 'Ethereum',
      balance: '2.5',
      price: 2300,
      value: 5750,
      change24h: 2.5,
      icon: '💎'
    },
    {
      symbol: 'USDC',
      name: 'USD Coin',
      balance: '1500',
      price: 1,
      value: 1500,
      change24h: 0.01,
      icon: '💵'
    },
    {
      symbol: 'MATIC',
      name: 'Polygon',
      balance: '850',
      price: 0.85,
      value: 722.5,
      change24h: -1.2,
      icon: '🟣'
    }
  ];
};
