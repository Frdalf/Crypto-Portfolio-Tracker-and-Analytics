import React from 'react';
import { Wallet, Sparkles } from 'lucide-react';
import { formatAddress } from '../utils/formatters';

const Header = ({ isConnected, walletAddress, loading, onConnect, onDisconnect }) => {
  return (
    <div className="mb-8 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-purple-500 blur-xl opacity-30 animate-pulse"></div>
              <Sparkles className="relative text-purple-400 animate-float" size={40} />
            </div>
            <h1 className="text-4xl font-bold mb-2 text-gradient text-glow">
              Crypto Portfolio Tracker
            </h1>
          </div>
          <p className="text-gray-400 animate-fade-in-up delay-200">Track your crypto assets across multiple chains</p>
        </div>
        
        {!isConnected ? (
          <button
            onClick={onConnect}
            disabled={loading}
            className="group relative flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-6 py-3 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 btn-glow overflow-hidden"
          >
            <Wallet size={20} className="group-hover:rotate-12 transition-transform duration-300" />
            <span>{loading ? 'Connecting...' : 'Connect Wallet'}</span>
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
          </button>
        ) : (
          <div className="flex items-center gap-4 animate-fade-in-scale">
            <div className="glass px-4 py-2 rounded-xl glass-hover">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <p className="text-sm text-gray-400">Connected</p>
              </div>
              <p className="font-mono text-purple-300">{formatAddress(walletAddress)}</p>
            </div>
            <button
              onClick={onDisconnect}
              className="relative bg-red-500/80 hover:bg-red-500 px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-red-500/25 ripple"
            >
              Disconnect
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
