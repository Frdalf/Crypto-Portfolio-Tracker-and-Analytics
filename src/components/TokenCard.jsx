import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

const TokenCard = ({ token, index = 0 }) => {
  // Safe defaults for all values
  const change24h = token?.change24h ?? 0;
  const isPositive = change24h >= 0;
  const balance = parseFloat(token?.balance) || 0;
  const price = token?.price ?? 0;
  const value = token?.value ?? 0;
  const symbol = token?.symbol || 'TOKEN';
  const name = token?.name || 'Unknown';
  const icon = token?.icon || '🪙';
  
  return (
    <div 
      className="group relative glass rounded-xl p-6 card-3d cursor-pointer"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Hover glow effect */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-purple-500/10 group-hover:via-purple-500/5 group-hover:to-pink-500/10 transition-all duration-500"></div>
      
      {/* Animated border on hover */}
      <div className="absolute inset-0 rounded-xl border border-slate-700 group-hover:border-purple-500/50 transition-colors duration-300"></div>
      
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-purple-500/20 blur-lg group-hover:blur-xl transition-all duration-300 rounded-full"></div>
              <span className="relative text-3xl group-hover:scale-110 transition-transform duration-300 inline-block">{icon}</span>
            </div>
            <div>
              <h3 className="font-bold text-white group-hover:text-purple-300 transition-colors duration-300">{symbol}</h3>
              <p className="text-sm text-gray-400">{name}</p>
            </div>
          </div>
          <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${isPositive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
            {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            <span className="text-sm font-semibold">
              {isPositive ? '+' : ''}{change24h.toFixed(2)}%
            </span>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
            <span className="text-gray-400 text-sm">Balance</span>
            <span className="font-semibold">{balance.toFixed(4)} {symbol}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
            <span className="text-gray-400 text-sm">Price</span>
            <span className="font-semibold">{formatCurrency(price)}</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-400 text-sm">Value</span>
            <span className="font-bold text-lg text-gradient">{formatCurrency(value)}</span>
          </div>
        </div>
        
        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-purple-500/0 to-transparent group-hover:via-purple-500 transition-all duration-500 rounded-full"></div>
      </div>
    </div>
  );
};

export default TokenCard;
