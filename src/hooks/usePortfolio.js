import { useState, useCallback } from 'react';
import { getDemoPortfolio, getPortfolio } from '../services/portfolioService';

export const usePortfolio = () => {
  const [portfolio, setPortfolio] = useState([]);
  const [totalValue, setTotalValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDemoMode, setIsDemoMode] = useState(true); // Track if showing demo data

  // Fetch Demo Portfolio (for preview before wallet connect)
  const fetchDemoPortfolio = useCallback(async () => {
    setLoading(true);
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
    }
  }, []);

  // Fetch Real Portfolio (after wallet connect) - always uses live API
  const fetchPortfolio = useCallback(async (address, chain = 'ethereum') => {
    setLoading(true);
    setError('');
    setIsDemoMode(false);
    
    console.log('Fetching LIVE portfolio...', { address, chain });
    
    try {
      const tokens = await getPortfolio(address, chain);
      console.log('Fetched tokens:', tokens);
      
      setPortfolio(tokens);
      const total = tokens.reduce((sum, token) => sum + token.value, 0);
      setTotalValue(total);
      
    } catch (err) {
      console.error('Portfolio fetch error:', err);
      setError('Failed to fetch portfolio: ' + err.message);
      
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
    }
  }, []);

  // Clear portfolio
  const clearPortfolio = useCallback(() => {
    setPortfolio([]);
    setTotalValue(0);
    setError('');
    setIsDemoMode(true);
  }, []);

  return {
    portfolio,
    totalValue,
    loading,
    error,
    isDemoMode,
    fetchPortfolio,
    fetchDemoPortfolio,
    clearPortfolio
  };
};
