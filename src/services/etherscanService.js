// Etherscan API V2 Service
import { EXPLORER_APIS } from '../config/api';

// Rate limiting helper - Etherscan free tier: 5 calls/second
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Timeout wrapper for fetch requests
const fetchWithTimeout = async (url, timeout = 10000) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Request timeout');
    }
    throw error;
  }
};

/**
 * Get ETH balance for an address
 */
export const getEthBalance = async (address, chain = 'ethereum') => {
  const { url, apiKey, chainId } = EXPLORER_APIS[chain] || EXPLORER_APIS.ethereum;
  
  try {
    const response = await fetchWithTimeout(
      `${url}?chainid=${chainId}&module=account&action=balance&address=${address}&tag=latest&apikey=${apiKey}`,
      8000 // 8 second timeout
    );
    
    const data = await response.json();
    
    console.log('ETH Balance API Response:', data); // Debug log
    
    if (data.status === '1') {
      // Convert from Wei to ETH
      return parseFloat(data.result) / 1e18;
    }
    
    // Handle specific error messages
    if (data.message === 'NOTOK' && data.result) {
      console.warn('Etherscan API warning:', data.result);
      // If rate limited or invalid key, return 0 instead of throwing
      return 0;
    }
    
    throw new Error(data.result || data.message || 'Failed to fetch balance');
  } catch (error) {
    console.error('getEthBalance error:', error);
    // Return 0 instead of throwing on timeout/network errors
    if (error.message === 'Request timeout') {
      console.warn('ETH balance request timed out');
      return 0;
    }
    throw error;
  }
};

/**
 * Get ERC-20 token balances for an address
 */
export const getTokenBalances = async (address, chain = 'ethereum') => {
  const { url, apiKey, chainId } = EXPLORER_APIS[chain] || EXPLORER_APIS.ethereum;
  
  try {
    const response = await fetchWithTimeout(
      `${url}?chainid=${chainId}&module=account&action=tokentx&address=${address}&page=1&offset=100&sort=desc&apikey=${apiKey}`,
      10000 // 10 second timeout
    );
    
    const data = await response.json();
    
    console.log('Token Balances API Response:', data); // Debug log
    
    if (data.status === '1' && Array.isArray(data.result)) {
      // Get unique tokens from transactions
      const tokenMap = new Map();
      
      data.result.forEach(tx => {
        if (!tokenMap.has(tx.contractAddress)) {
          tokenMap.set(tx.contractAddress, {
            contractAddress: tx.contractAddress,
            symbol: tx.tokenSymbol,
            name: tx.tokenName,
            decimals: parseInt(tx.tokenDecimal),
          });
        }
      });
      
      return Array.from(tokenMap.values());
    }
    
    // No token transactions found - this is okay, not an error
    if (data.message === 'No transactions found' || data.result === 'No transactions found') {
      return [];
    }
    
    // Handle NOTOK but don't throw - just return empty
    if (data.message === 'NOTOK') {
      console.warn('Etherscan API warning:', data.result);
      return [];
    }
    
    return [];
  } catch (error) {
    console.error('getTokenBalances error:', error);
    return [];
  }
};

/**
 * Get specific token balance
 */
export const getTokenBalance = async (address, contractAddress, chain = 'ethereum') => {
  const { url, apiKey, chainId } = EXPLORER_APIS[chain] || EXPLORER_APIS.ethereum;
  
  try {
    const response = await fetchWithTimeout(
      `${url}?chainid=${chainId}&module=account&action=tokenbalance&contractaddress=${contractAddress}&address=${address}&tag=latest&apikey=${apiKey}`,
      5000 // 5 second timeout per token
    );
    
    const data = await response.json();
    
    if (data.status === '1') {
      return data.result;
    }
    
    return '0';
  } catch (error) {
    console.error('getTokenBalance error:', error);
    return '0';
  }
};

/**
 * Get multiple token balances in parallel batches
 * This is faster than sequential calls
 */
export const getTokenBalancesBatch = async (address, tokens, chain = 'ethereum') => {
  const BATCH_SIZE = 5; // Process 5 tokens at a time to avoid rate limiting
  const results = [];
  
  for (let i = 0; i < tokens.length; i += BATCH_SIZE) {
    const batch = tokens.slice(i, i + BATCH_SIZE);
    
    // Process batch in parallel
    const batchResults = await Promise.all(
      batch.map(async (token) => {
        const rawBalance = await getTokenBalance(address, token.contractAddress, chain);
        const balance = parseFloat(rawBalance) / Math.pow(10, token.decimals || 18);
        return { ...token, balance };
      })
    );
    
    results.push(...batchResults);
    
    // Small delay between batches to avoid rate limiting
    if (i + BATCH_SIZE < tokens.length) {
      await delay(200);
    }
  }
  
  return results;
};

/**
 * Get transaction history
 */
export const getTransactionHistory = async (address, chain = 'ethereum') => {
  const { url, apiKey, chainId } = EXPLORER_APIS[chain] || EXPLORER_APIS.ethereum;
  
  try {
    const response = await fetchWithTimeout(
      `${url}?chainid=${chainId}&module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=50&sort=desc&apikey=${apiKey}`,
      10000 // 10 second timeout
    );
    
    const data = await response.json();
    
    if (data.status === '1' && Array.isArray(data.result)) {
      return data.result.map(tx => ({
        hash: tx.hash,
        from: tx.from,
        to: tx.to,
        value: parseFloat(tx.value) / 1e18,
        timestamp: new Date(parseInt(tx.timeStamp) * 1000),
        gasUsed: tx.gasUsed,
        isError: tx.isError === '1',
      }));
    }
    
    return [];
  } catch (error) {
    console.error('getTransactionHistory error:', error);
    return [];
  }
};
