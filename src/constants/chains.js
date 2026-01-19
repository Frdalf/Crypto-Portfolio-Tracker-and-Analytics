// Supported blockchain networks configuration

export const CHAINS = {
  ethereum: {
    id: 'ethereum',
    name: 'Ethereum',
    chainId: 1,
    symbol: 'ETH',
    explorer: 'https://etherscan.io',
    rpcUrl: 'https://mainnet.infura.io/v3/',
    color: '#627EEA'
  },
  polygon: {
    id: 'polygon',
    name: 'Polygon',
    chainId: 137,
    symbol: 'MATIC',
    explorer: 'https://polygonscan.com',
    rpcUrl: 'https://polygon-rpc.com',
    color: '#8247E5'
  },
  bsc: {
    id: 'bsc',
    name: 'BNB Smart Chain',
    chainId: 56,
    symbol: 'BNB',
    explorer: 'https://bscscan.com',
    rpcUrl: 'https://bsc-dataseed.binance.org',
    color: '#F0B90B'
  },
  arbitrum: {
    id: 'arbitrum',
    name: 'Arbitrum',
    chainId: 42161,
    symbol: 'ETH',
    explorer: 'https://arbiscan.io',
    rpcUrl: 'https://arb1.arbitrum.io/rpc',
    color: '#28A0F0'
  },
  optimism: {
    id: 'optimism',
    name: 'Optimism',
    chainId: 10,
    symbol: 'ETH',
    explorer: 'https://optimistic.etherscan.io',
    rpcUrl: 'https://mainnet.optimism.io',
    color: '#FF0420'
  }
};

export const DEFAULT_CHAIN = 'ethereum';

export const getChainById = (chainId) => {
  return Object.values(CHAINS).find(chain => chain.chainId === chainId);
};

export const getChainByKey = (key) => {
  return CHAINS[key];
};
