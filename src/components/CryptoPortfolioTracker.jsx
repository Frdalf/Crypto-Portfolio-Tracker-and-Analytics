import React, { useState, useEffect } from 'react';
import Header from './Header';
import ErrorMessage from './ErrorMessage';
import TotalValueCard from './TotalValueCard';
import PortfolioGrid from './PortfolioGrid';
import QuickStats from './QuickStats';
import WelcomeScreen from './WelcomeScreen';
import TransactionHistory from './TransactionHistory';
import { 
  PortfolioPieChart, 
  PerformanceBarChart, 
  PriceHistoryChart, 
  PortfolioValueChart 
} from './charts';
import { useWallet } from '../hooks/useWallet';
import { usePortfolio } from '../hooks/usePortfolio';

const CryptoPortfolioTracker = () => {
  const [selectedChain, setSelectedChain] = useState('ethereum');
  
  const {
    walletAddress,
    isConnected,
    loading: walletLoading,
    error: walletError,
    connectWallet,
    disconnectWallet
  } = useWallet();

  const {
    portfolio,
    totalValue,
    loading: portfolioLoading,
    error: portfolioError,
    isDemoMode,
    fetchPortfolio,
    fetchDemoPortfolio,
    clearPortfolio
  } = usePortfolio();

  const loading = walletLoading || portfolioLoading;
  const error = walletError || portfolioError;

  // Load demo portfolio on mount for preview
  useEffect(() => {
    if (!isConnected) {
      fetchDemoPortfolio();
    }
  }, []);

  const handleConnect = async () => {
    const address = await connectWallet();
    if (address) {
      // Always use live API after wallet connect
      await fetchPortfolio(address, selectedChain);
    }
  };

  const handleRefresh = () => {
    if (walletAddress) {
      fetchPortfolio(walletAddress, selectedChain);
    }
  };

  const handleDisconnect = () => {
    disconnectWallet();
    clearPortfolio();
    // Load demo data again after disconnect
    fetchDemoPortfolio();
  };

  const handleChainChange = (chain) => {
    setSelectedChain(chain);
    if (walletAddress) {
      fetchPortfolio(walletAddress, chain);
    }
  };

  return (
    <div className="min-h-screen bg-mesh text-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-float delay-500"></div>
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-float delay-300"></div>
      </div>
      
      {/* Grid pattern overlay */}
      <div className="fixed inset-0 opacity-5 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(139, 92, 246, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 92, 246, 0.3) 1px, transparent 1px)',
        backgroundSize: '50px 50px'
      }}></div>
      
      <div className="relative max-w-7xl mx-auto p-6">
        
        <Header
          isConnected={isConnected}
          walletAddress={walletAddress}
          loading={loading}
          onConnect={handleConnect}
          onDisconnect={handleDisconnect}
        />

        <ErrorMessage error={error} />

        {/* Demo Mode Banner - shows when not connected */}
        {!isConnected && isDemoMode && portfolio.length > 0 && (
          <div className="mb-6 animate-fade-in-up">
            <div className="glass rounded-xl p-4 border border-purple-500/30 bg-purple-500/10">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/20">
                    <span className="text-xl">👀</span>
                  </div>
                  <div>
                    <p className="font-semibold text-white">Preview Mode</p>
                    <p className="text-sm text-gray-400">Connect your wallet to see your real portfolio</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-sm font-medium border border-purple-500/30">
                  Demo Data
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Show portfolio content - either demo (before connect) or real (after connect) */}
        {(isConnected || portfolio.length > 0) && (
          <>
            <TotalValueCard
              totalValue={totalValue}
              loading={loading}
              selectedChain={selectedChain}
              onChainChange={handleChainChange}
              onRefresh={handleRefresh}
              isDemoMode={isDemoMode && !isConnected}
            />

            <PortfolioGrid portfolio={portfolio} loading={loading} />

            {/* Charts Section */}
            {portfolio.length > 0 && (
              <div className="mt-8 animate-fade-in-up">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-purple-500/20">
                    <span className="text-2xl">📊</span>
                  </div>
                  <h2 className="text-xl font-bold text-white">Analytics & Charts</h2>
                </div>
                
                {/* Portfolio Overview Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <div className="animate-fade-in-up delay-100">
                    <PortfolioPieChart portfolio={portfolio} />
                  </div>
                  <div className="animate-fade-in-up delay-200">
                    <PerformanceBarChart portfolio={portfolio} />
                  </div>
                </div>

                {/* Price & Value Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="animate-fade-in-up delay-300">
                    <PriceHistoryChart 
                      tokenId="ethereum" 
                      tokenSymbol="ETH" 
                      days={7} 
                    />
                  </div>
                  <div className="animate-fade-in-up delay-400">
                    <PortfolioValueChart 
                      portfolio={portfolio} 
                      totalValue={totalValue} 
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Transaction History - only show when connected */}
            {isConnected && (
              <TransactionHistory 
                walletAddress={walletAddress}
                chain={selectedChain}
                useRealData={true}
              />
            )}

            <QuickStats portfolio={portfolio} />
          </>
        )}

        {/* Welcome screen only shows when no portfolio loaded */}
        {!isConnected && portfolio.length === 0 && <WelcomeScreen />}
      </div>
    </div>
  );
};

export default CryptoPortfolioTracker;
