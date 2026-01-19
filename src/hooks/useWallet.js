import { useState } from 'react';

export const useWallet = () => {
  const [walletAddress, setWalletAddress] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState('');
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
      setLoadingStatus('🔐 Requesting MetaMask connection...');
      setError('');
      
      console.log('Requesting MetaMask accounts...');
      
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      console.log('MetaMask accounts received:', accounts);
      setLoadingStatus('✅ Wallet connected! Getting address...');
      
      const address = accounts[0];
      setWalletAddress(address);
      setIsConnected(true);
      setLoadingStatus('');
      
      return address;
      
    } catch (err) {
      console.error('Wallet connection error:', err);
      setError('Failed to connect wallet: ' + err.message);
      setLoadingStatus('');
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
    setLoadingStatus('');
  };

  return {
    walletAddress,
    isConnected,
    loading,
    loadingStatus,
    error,
    connectWallet,
    disconnectWallet,
    isMetaMaskInstalled
  };
};
