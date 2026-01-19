import React from 'react';
import { Inbox, Loader2 } from 'lucide-react';
import TokenCard from './TokenCard';

const PortfolioGrid = ({ portfolio, loading }) => {
  if (loading) {
    return (
      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass rounded-xl p-6 animate-pulse">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full skeleton"></div>
                <div className="flex-1">
                  <div className="h-4 w-16 skeleton mb-2"></div>
                  <div className="h-3 w-24 skeleton"></div>
                </div>
                <div className="h-6 w-16 skeleton rounded-lg"></div>
              </div>
              <div className="space-y-3">
                <div className="h-4 skeleton"></div>
                <div className="h-4 skeleton"></div>
                <div className="h-5 skeleton"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (portfolio.length === 0) {
    return (
      <div className="glass rounded-xl p-12 mb-6 text-center animate-fade-in-scale">
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-slate-500 blur-2xl opacity-20"></div>
          <Inbox className="relative mx-auto mb-4 text-gray-500 animate-float" size={56} />
        </div>
        <h3 className="text-xl font-semibold text-gray-400 mb-2">No Assets Found</h3>
        <p className="text-gray-500 max-w-md mx-auto">
          This wallet doesn't have any tokens on the selected chain, or the balance is too small to display.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
      {portfolio.map((token, index) => (
        <div 
          key={index} 
          className="animate-fade-in-up"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <TokenCard token={token} index={index} />
        </div>
      ))}
    </div>
  );
};

export default PortfolioGrid;
