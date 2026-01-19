import React, { useState, useEffect } from 'react';
import { RefreshCw, TrendingUp } from 'lucide-react';
import ChainSelector from './ChainSelector';
import { formatCurrency } from '../utils/formatters';

const TotalValueCard = ({ totalValue, loading, selectedChain, onChainChange, onRefresh, isDemoMode = false }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);

  // Animate value change
  useEffect(() => {
    setIsUpdating(true);
    const duration = 1000;
    const steps = 30;
    const stepDuration = duration / steps;
    const increment = (totalValue - displayValue) / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      if (currentStep >= steps) {
        setDisplayValue(totalValue);
        setIsUpdating(false);
        clearInterval(timer);
      } else {
        setDisplayValue(prev => prev + increment);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [totalValue]);

  return (
    <div className="relative overflow-hidden animate-fade-in-up delay-100">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-purple-500/20 animate-gradient-flow rounded-2xl"></div>
      
      <div className="relative glass gradient-border rounded-2xl p-8 mb-6">
        {/* Floating particles */}
        <div className="absolute top-4 right-20 w-2 h-2 bg-purple-400/50 rounded-full animate-float"></div>
        <div className="absolute bottom-8 right-40 w-1 h-1 bg-pink-400/50 rounded-full animate-float delay-300"></div>
        
        {/* Demo mode indicator */}
        {isDemoMode && (
          <div className="absolute top-4 right-4">
            <span className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-300 text-xs font-medium border border-yellow-500/30 flex items-center gap-1">
              <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
              Demo
            </span>
          </div>
        )}
        
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="text-purple-400" size={20} />
              <p className="text-gray-400">Total Portfolio Value</p>
            </div>
            <h2 className={`text-5xl font-bold transition-all duration-300 ${isUpdating ? 'text-purple-300 scale-105' : 'text-white'}`}>
              {formatCurrency(displayValue)}
            </h2>
          </div>
          <button
            onClick={onRefresh}
            disabled={loading}
            className="group glass p-3 rounded-xl transition-all duration-300 hover:bg-purple-500/20 disabled:opacity-50 hover:scale-110"
          >
            <RefreshCw 
              size={24} 
              className={`transition-all duration-300 ${loading ? 'animate-spin text-purple-400' : 'group-hover:text-purple-400'}`} 
            />
          </button>
        </div>
        
        <ChainSelector selectedChain={selectedChain} onChainChange={onChainChange} />
      </div>
    </div>
  );
};

export default TotalValueCard;
