import React from 'react';

const chains = [
  { id: 'ethereum', name: 'Ethereum', icon: '⟠', gradient: 'from-blue-500 to-blue-600', glow: 'shadow-blue-500/30' },
  { id: 'polygon', name: 'Polygon', icon: '⬡', gradient: 'from-purple-500 to-purple-600', glow: 'shadow-purple-500/30' },
  { id: 'bsc', name: 'BSC', icon: '◆', gradient: 'from-yellow-500 to-yellow-600', glow: 'shadow-yellow-500/30' }
];

const ChainSelector = ({ selectedChain, onChainChange }) => {
  return (
    <div className="flex gap-3">
      {chains.map((chain, index) => {
        const isSelected = selectedChain === chain.id;
        return (
          <button
            key={chain.id}
            onClick={() => onChainChange(chain.id)}
            className={`group relative px-5 py-2.5 rounded-xl font-medium transition-all duration-300 overflow-hidden ${
              isSelected 
                ? `bg-gradient-to-r ${chain.gradient} text-white shadow-lg ${chain.glow}` 
                : 'glass text-gray-400 hover:text-white hover:border-slate-600'
            }`}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {/* Background glow effect */}
            {isSelected && (
              <div className={`absolute inset-0 bg-gradient-to-r ${chain.gradient} opacity-50 blur-xl`}></div>
            )}
            
            {/* Hover overlay */}
            <div className={`absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300`}></div>
            
            <span className="relative flex items-center gap-2">
              <span className={`text-lg transition-transform duration-300 ${isSelected ? 'scale-110' : 'group-hover:scale-110'}`}>
                {chain.icon}
              </span>
              <span>{chain.name}</span>
            </span>
            
            {/* Selection indicator */}
            {isSelected && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-white/50 rounded-full"></span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default ChainSelector;
