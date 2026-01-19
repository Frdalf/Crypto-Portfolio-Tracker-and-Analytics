import React from 'react';
import { Wallet, Coins, BarChart3, Shield } from 'lucide-react';

const WelcomeScreen = () => {
  const features = [
    { icon: Coins, title: 'Multi-Chain', desc: 'Track assets across Ethereum, Polygon, BSC' },
    { icon: BarChart3, title: 'Analytics', desc: 'Visualize your portfolio performance' },
    { icon: Shield, title: 'Secure', desc: 'Read-only access, your keys stay safe' },
  ];

  return (
    <div className="text-center py-16 animate-fade-in-up">
      {/* Animated wallet icon */}
      <div className="relative inline-block mb-8">
        <div className="absolute inset-0 bg-purple-500 blur-3xl opacity-20 animate-pulse"></div>
        <div className="relative animate-float">
          <div className="p-6 rounded-full glass animate-pulse-glow">
            <Wallet className="text-purple-400" size={64} />
          </div>
        </div>
        {/* Orbiting dots */}
        <div className="absolute top-0 left-1/2 w-3 h-3 bg-pink-400 rounded-full animate-float" style={{ animationDelay: '0.2s' }}></div>
        <div className="absolute bottom-4 right-0 w-2 h-2 bg-blue-400 rounded-full animate-float" style={{ animationDelay: '0.4s' }}></div>
        <div className="absolute bottom-0 left-4 w-2 h-2 bg-green-400 rounded-full animate-float" style={{ animationDelay: '0.6s' }}></div>
      </div>
      
      <h2 className="text-4xl font-bold mb-4 text-gradient animate-fade-in-up delay-200">
        Connect Your Wallet to Get Started
      </h2>
      <p className="text-gray-400 max-w-lg mx-auto mb-12 text-lg animate-fade-in-up delay-300">
        Track your crypto portfolio across multiple blockchains, analyze performance, and get insights on your investments.
      </p>
      
      {/* Feature cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
        {features.map((feature, index) => (
          <div 
            key={index}
            className="glass rounded-xl p-6 hover-lift animate-fade-in-up"
            style={{ animationDelay: `${400 + index * 100}ms` }}
          >
            <div className="p-3 rounded-lg bg-purple-500/20 w-fit mx-auto mb-4">
              <feature.icon className="text-purple-400" size={24} />
            </div>
            <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
            <p className="text-sm text-gray-400">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WelcomeScreen;
