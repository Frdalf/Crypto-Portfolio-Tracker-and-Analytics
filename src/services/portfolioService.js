// Portfolio Service
// Integrates Etherscan and CoinGecko APIs

import { getEthBalance, getTokenBalances, getTokenBalance } from './etherscanService';
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
 */
export const getPortfolio = async (address, chain = 'ethereum') => {
  try {
    const portfolio = [];

    // 1. Get native token balance (ETH/MATIC/BNB)
    const nativeBalance = await getEthBalance(address, chain);
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

    // 2. Get ERC-20 tokens using Etherscan
    const tokens = await getTokenBalances(address, chain);
    
    for (const token of tokens.slice(0, 20)) { // Limit to 20 tokens
      const rawBalance = await getTokenBalance(address, token.contractAddress, chain);
      const balance = parseFloat(rawBalance) / Math.pow(10, token.decimals || 18);
      
      if (balance > 0.0001) { // Filter dust
        portfolio.push({
          symbol: token.symbol,
          name: token.name,
          balance: balance.toFixed(6),
          contractAddress: token.contractAddress,
          isNative: false,
        });
      }
    }

    // 3. Get prices for all tokens
    const symbols = portfolio.map(t => t.symbol);
    const prices = await getTokenPrices(symbols);

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

    // Sort by value (highest first)
    return portfolioWithPrices.sort((a, b) => b.value - a.value);

  } catch (error) {
    console.error('Failed to fetch portfolio:', error);
    throw error;
  }
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
