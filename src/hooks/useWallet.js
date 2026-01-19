import { useState } from 'react';

export const useWallet = () => {
  const [walletAddress, setWalletAddress] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Check if MetaMask is installed
  const isMetaMaskInstalled = () => {
    return typeof window.ethereum !== 'undefined';
  };

  // Connect Wallet
  const connectWallet = async () => {
    if (!isMetaMaskInstalled()) {
      setError('Please install MetaMask to use this app');
      return null;
    }

    try {
      setLoading(true);
      setError('');
      
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      const address = accounts[0];
      setWalletAddress(address);
      setIsConnected(true);
      
      return address;
      
    } catch (err) {
      setError('Failed to connect wallet: ' + err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Disconnect Wallet
  const disconnectWallet = () => {
    setWalletAddress('');
    setIsConnected(false);
    setError('');
  };

  return {
    walletAddress,
    isConnected,
    loading,
    error,
    connectWallet,
    disconnectWallet,
    isMetaMaskInstalled
  };
};
