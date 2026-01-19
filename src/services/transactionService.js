// Transaction Service - Fetch transaction history from Etherscan API
import { EXPLORER_APIS, API_KEYS } from '../config/api';

/**
 * Get transaction history for an address
 */
export const getTransactionHistory = async (address, chain = 'ethereum', page = 1, limit = 25) => {
  const apiConfig = EXPLORER_APIS[chain];
  if (!apiConfig) {
    throw new Error(`Unsupported chain: ${chain}`);
  }

  const apiKey = API_KEYS[chain];
  
  try {
    // Fetch normal transactions
    const response = await fetch(
      `${apiConfig.baseUrl}?chainid=${apiConfig.chainId}&module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=${page}&offset=${limit}&sort=desc&apikey=${apiKey}`
    );

    const data = await response.json();

    if (data.status === '0' && data.message === 'No transactions found') {
      return [];
    }

    if (data.status === '0') {
      console.warn('Transaction API warning:', data.message);
      return [];
    }

    return data.result.map(tx => formatTransaction(tx, address, chain));
  } catch (error) {
    console.error('Failed to fetch transactions:', error);
    return [];
  }
};

/**
 * Get ERC-20 token transfer history
 */
export const getTokenTransfers = async (address, chain = 'ethereum', page = 1, limit = 25) => {
  const apiConfig = EXPLORER_APIS[chain];
  if (!apiConfig) {
    throw new Error(`Unsupported chain: ${chain}`);
  }

  const apiKey = API_KEYS[chain];
  
  try {
    const response = await fetch(
      `${apiConfig.baseUrl}?chainid=${apiConfig.chainId}&module=account&action=tokentx&address=${address}&startblock=0&endblock=99999999&page=${page}&offset=${limit}&sort=desc&apikey=${apiKey}`
    );

    const data = await response.json();

    if (data.status === '0' && data.message === 'No transactions found') {
      return [];
    }

    if (data.status === '0') {
      console.warn('Token transfer API warning:', data.message);
      return [];
    }

    return data.result.map(tx => formatTokenTransfer(tx, address, chain));
  } catch (error) {
    console.error('Failed to fetch token transfers:', error);
    return [];
  }
};

/**
 * Format a normal transaction
 */
const formatTransaction = (tx, userAddress, chain) => {
  const isOutgoing = tx.from.toLowerCase() === userAddress.toLowerCase();
  const value = parseFloat(tx.value) / 1e18;
  
  return {
    hash: tx.hash,
    type: 'transfer',
    direction: isOutgoing ? 'out' : 'in',
    from: tx.from,
    to: tx.to,
    value: value,
    symbol: getChainSymbol(chain),
    timestamp: new Date(parseInt(tx.timeStamp) * 1000),
    gasUsed: tx.gasUsed,
    gasPrice: tx.gasPrice,
    gasFee: (parseFloat(tx.gasUsed) * parseFloat(tx.gasPrice)) / 1e18,
    status: tx.txreceipt_status === '1' ? 'success' : tx.txreceipt_status === '0' ? 'failed' : 'pending',
    blockNumber: tx.blockNumber,
    chain,
    isContract: tx.to && tx.input !== '0x',
    methodId: tx.methodId,
    functionName: tx.functionName || '',
  };
};

/**
 * Format a token transfer
 */
const formatTokenTransfer = (tx, userAddress, chain) => {
  const isOutgoing = tx.from.toLowerCase() === userAddress.toLowerCase();
  const decimals = parseInt(tx.tokenDecimal) || 18;
  const value = parseFloat(tx.value) / Math.pow(10, decimals);
  
  return {
    hash: tx.hash,
    type: 'token_transfer',
    direction: isOutgoing ? 'out' : 'in',
    from: tx.from,
    to: tx.to,
    value: value,
    symbol: tx.tokenSymbol,
    tokenName: tx.tokenName,
    tokenAddress: tx.contractAddress,
    timestamp: new Date(parseInt(tx.timeStamp) * 1000),
    gasUsed: tx.gasUsed,
    gasPrice: tx.gasPrice,
    gasFee: (parseFloat(tx.gasUsed) * parseFloat(tx.gasPrice)) / 1e18,
    blockNumber: tx.blockNumber,
    chain,
  };
};

/**
 * Get native token symbol for chain
 */
const getChainSymbol = (chain) => {
  const symbols = {
    ethereum: 'ETH',
    polygon: 'MATIC',
    bsc: 'BNB',
  };
  return symbols[chain] || 'ETH';
};

/**
 * Get combined transaction history (normal + token transfers)
 */
export const getAllTransactions = async (address, chain = 'ethereum', page = 1, limit = 50) => {
  try {
    const [normalTxs, tokenTxs] = await Promise.all([
      getTransactionHistory(address, chain, page, limit),
      getTokenTransfers(address, chain, page, limit),
    ]);

    // Combine and sort by timestamp (newest first)
    const allTxs = [...normalTxs, ...tokenTxs]
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);

    return allTxs;
  } catch (error) {
    console.error('Failed to fetch all transactions:', error);
    return [];
  }
};

/**
 * Generate demo transaction data
 */
export const getDemoTransactions = () => {
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;
  
  return [
    {
      hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      type: 'transfer',
      direction: 'in',
      from: '0x742d35Cc6634C0532925a3b844Bc9e7595f5e1Fd',
      to: '0x2f691fEB4FD0e7c2855e9A3E3FaA7e4b38a4dCb8',
      value: 0.5,
      symbol: 'ETH',
      timestamp: new Date(now - 2 * day),
      gasFee: 0.002,
      status: 'success',
      blockNumber: '18934567',
      chain: 'ethereum',
    },
    {
      hash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
      type: 'token_transfer',
      direction: 'out',
      from: '0x2f691fEB4FD0e7c2855e9A3E3FaA7e4b38a4dCb8',
      to: '0x8ba1f109551bD432803012645Hac136c22C5742',
      value: 1000,
      symbol: 'USDC',
      tokenName: 'USD Coin',
      timestamp: new Date(now - 3 * day),
      gasFee: 0.003,
      status: 'success',
      blockNumber: '18934123',
      chain: 'ethereum',
    },
    {
      hash: '0x567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234',
      type: 'transfer',
      direction: 'out',
      from: '0x2f691fEB4FD0e7c2855e9A3E3FaA7e4b38a4dCb8',
      to: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      value: 0.15,
      symbol: 'ETH',
      timestamp: new Date(now - 5 * day),
      gasFee: 0.004,
      status: 'success',
      blockNumber: '18933890',
      chain: 'ethereum',
      isContract: true,
      functionName: 'swap(uint256,address)',
    },
    {
      hash: '0x890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456',
      type: 'token_transfer',
      direction: 'in',
      from: '0x1f9090aaE28b8a3dCeaDf281B0F12828e676c326',
      to: '0x2f691fEB4FD0e7c2855e9A3E3FaA7e4b38a4dCb8',
      value: 0.025,
      symbol: 'WBTC',
      tokenName: 'Wrapped Bitcoin',
      timestamp: new Date(now - 7 * day),
      gasFee: 0.005,
      status: 'success',
      blockNumber: '18932456',
      chain: 'ethereum',
    },
    {
      hash: '0xcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890ab',
      type: 'transfer',
      direction: 'in',
      from: '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B',
      to: '0x2f691fEB4FD0e7c2855e9A3E3FaA7e4b38a4dCb8',
      value: 1.25,
      symbol: 'ETH',
      timestamp: new Date(now - 10 * day),
      gasFee: 0.002,
      status: 'success',
      blockNumber: '18930123',
      chain: 'ethereum',
    },
    {
      hash: '0xef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcd',
      type: 'token_transfer',
      direction: 'out',
      from: '0x2f691fEB4FD0e7c2855e9A3E3FaA7e4b38a4dCb8',
      to: '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45',
      value: 500,
      symbol: 'LINK',
      tokenName: 'Chainlink',
      timestamp: new Date(now - 12 * day),
      gasFee: 0.006,
      status: 'success',
      blockNumber: '18928765',
      chain: 'ethereum',
    },
    {
      hash: '0x34567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12',
      type: 'transfer',
      direction: 'out',
      from: '0x2f691fEB4FD0e7c2855e9A3E3FaA7e4b38a4dCb8',
      to: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
      value: 0.08,
      symbol: 'ETH',
      timestamp: new Date(now - 15 * day),
      gasFee: 0.012,
      status: 'failed',
      blockNumber: '18925432',
      chain: 'ethereum',
      isContract: true,
      functionName: 'swapExactTokensForETH()',
    },
  ];
};
