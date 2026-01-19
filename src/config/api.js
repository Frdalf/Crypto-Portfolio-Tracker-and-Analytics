// API Configuration
// Keys are loaded from environment variables

export const API_KEYS = {
  ETHERSCAN: import.meta.env.VITE_ETHERSCAN_API_KEY,
  POLYGONSCAN: import.meta.env.VITE_POLYGONSCAN_API_KEY,
  BSCSCAN: import.meta.env.VITE_BSCSCAN_API_KEY,
};

export const API_ENDPOINTS = {
  // Etherscan APIs V2
  ETHERSCAN: 'https://api.etherscan.io/v2/api',
  POLYGONSCAN: 'https://api.polygonscan.com/v2/api',
  BSCSCAN: 'https://api.bscscan.com/v2/api',
  
  // CoinGecko (free, no API key needed)
  COINGECKO: 'https://api.coingecko.com/api/v3',
};

// Chain IDs for Etherscan V2 API
export const CHAIN_IDS = {
  ethereum: 1,
  polygon: 137,
  bsc: 56,
};

// Chain-specific explorer APIs
export const EXPLORER_APIS = {
  ethereum: {
    url: API_ENDPOINTS.ETHERSCAN,
    apiKey: API_KEYS.ETHERSCAN,
    chainId: CHAIN_IDS.ethereum,
  },
  polygon: {
    url: API_ENDPOINTS.ETHERSCAN, // V2 uses single endpoint with chainid
    apiKey: API_KEYS.POLYGONSCAN || API_KEYS.ETHERSCAN,
    chainId: CHAIN_IDS.polygon,
  },
  bsc: {
    url: API_ENDPOINTS.ETHERSCAN, // V2 uses single endpoint with chainid
    apiKey: API_KEYS.BSCSCAN || API_KEYS.ETHERSCAN,
    chainId: CHAIN_IDS.bsc,
  },
};
