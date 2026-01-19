import { useState, useCallback } from 'react';
import { getDemoPortfolio, getPortfolio } from '../services/portfolioService';

export const usePortfolio = () => {
  const [portfolio, setPortfolio] = useState([]);
  const [totalValue, setTotalValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(''); // Detailed loading status
  const [error, setError] = useState('');
  const [isDemoMode, setIsDemoMode] = useState(true); // Track if showing demo data

  // Fetch Demo Portfolio (for preview before wallet connect)
  const fetchDemoPortfolio = useCallback(async () => {
    setLoading(true);
    setLoadingStatus('Loading demo data...');
    setError('');
    setIsDemoMode(true);
    
    try {
      const demoTokens = await getDemoPortfolio('demo');
      setPortfolio(demoTokens);
      const total = demoTokens.reduce((sum, token) => sum + token.value, 0);
      setTotalValue(total);
    } catch (err) {
      console.error('Demo portfolio error:', err);
    } finally {
      setLoading(false);
      setLoadingStatus('');
    }
  }, []);

  // Fetch Real Portfolio (after wallet connect) - always uses live API
  const fetchPortfolio = useCallback(async (address, chain = 'ethereum') => {
    setLoading(true);
    setLoadingStatus('Starting portfolio fetch...');
    setError('');
    setIsDemoMode(false);
    
    console.log('Fetching LIVE portfolio...', { address, chain });
    
    try {
      const tokens = await getPortfolio(address, chain, setLoadingStatus);
      console.log('Fetched tokens:', tokens);
      
      setPortfolio(tokens);
      const total = tokens.reduce((sum, token) => sum + token.value, 0);
      setTotalValue(total);
      setLoadingStatus('Complete!');
      
    } catch (err) {
      console.error('Portfolio fetch error:', err);
      setError('Failed to fetch portfolio: ' + err.message);
      setLoadingStatus('Error - falling back to demo...');
      
      // Fallback to demo data on error
      console.log('Falling back to demo data...');
      setIsDemoMode(true);
      try {
        const demoTokens = await getDemoPortfolio(address);
        setPortfolio(demoTokens);
        const total = demoTokens.reduce((sum, token) => sum + token.value, 0);
        setTotalValue(total);
      } catch (fallbackErr) {
        console.error('Fallback also failed:', fallbackErr);
      }
    } finally {
      setLoading(false);
      setTimeout(() => setLoadingStatus(''), 2000); // Clear status after 2s
    }
  }, []);

  // Clear portfolio
  const clearPortfolio = useCallback(() => {
    setPortfolio([]);
    setTotalValue(0);
    setError('');
    setLoadingStatus('');
    setIsDemoMode(true);
  }, []);

  return {
    portfolio,
    totalValue,
    loading,
    loadingStatus,
    error,
    isDemoMode,
    fetchPortfolio,
    fetchDemoPortfolio,
    clearPortfolio
  };
};
