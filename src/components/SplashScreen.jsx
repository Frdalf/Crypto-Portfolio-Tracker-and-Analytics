import React, { useState, useEffect } from 'react';

const SplashScreen = ({ onComplete }) => {
  const [phase, setPhase] = useState(1); // 1: logo appears, 2: text appears, 3: fade out

  useEffect(() => {
    // Phase 2: Show text after logo animation
    const timer1 = setTimeout(() => setPhase(2), 600);
    
    // Phase 3: Start fade out
    const timer2 = setTimeout(() => setPhase(3), 2000);
    
    // Complete and unmount
    const timer3 = setTimeout(() => onComplete(), 2500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center bg-[#0a0a1a] transition-opacity duration-500 ${
        phase === 3 ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-pink-600/20 rounded-full blur-[100px] animate-pulse delay-300"></div>
        <div className="absolute bottom-1/3 right-1/3 w-[300px] h-[300px] bg-blue-600/20 rounded-full blur-[80px] animate-pulse delay-500"></div>
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: 'linear-gradient(rgba(139, 92, 246, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 92, 246, 0.5) 1px, transparent 1px)',
        backgroundSize: '60px 60px'
      }}></div>

      {/* Content */}
      <div className="relative z-10 text-center">
        {/* Logo/Icon */}
        <div 
          className={`mb-6 transition-all duration-700 ease-out ${
            phase >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
          }`}
        >
          {/* Animated Logo Container */}
          <div className="relative inline-block">
            {/* Outer ring */}
            <div className="absolute inset-0 rounded-full border-2 border-purple-500/30 animate-ping"></div>
            
            {/* Middle ring */}
            <div 
              className="w-28 h-28 mx-auto rounded-full bg-gradient-to-br from-purple-600 via-pink-500 to-purple-700 p-1 animate-spin-slow"
              style={{ animationDuration: '3s' }}
            >
              <div className="w-full h-full rounded-full bg-[#0a0a1a] flex items-center justify-center">
                {/* Icon */}
                <div className="relative">
                  <span className="text-5xl">💎</span>
                  {/* Sparkle effects */}
                  <span className="absolute -top-1 -right-1 text-xs animate-pulse">✨</span>
                  <span className="absolute -bottom-1 -left-1 text-xs animate-pulse delay-200">✨</span>
                </div>
              </div>
            </div>

            {/* Orbiting dots */}
            <div className="absolute inset-0 animate-spin-slow" style={{ animationDuration: '4s' }}>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-purple-400 rounded-full"></div>
            </div>
            <div className="absolute inset-0 animate-spin-slow" style={{ animationDuration: '6s', animationDirection: 'reverse' }}>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-pink-400 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 
          className={`text-4xl md:text-5xl font-bold mb-3 transition-all duration-700 delay-100 ${
            phase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient-flow">
            Crypto Portfolio
          </span>
        </h1>

        {/* Subtitle */}
        <p 
          className={`text-gray-400 text-lg mb-8 transition-all duration-700 delay-200 ${
            phase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          Track • Analyze • Grow
        </p>

        {/* Loading bar */}
        <div 
          className={`w-48 h-1 mx-auto bg-gray-800 rounded-full overflow-hidden transition-all duration-500 delay-300 ${
            phase >= 2 ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div 
            className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 rounded-full animate-loading-bar"
          ></div>
        </div>

        {/* Loading text */}
        <p 
          className={`mt-4 text-sm text-gray-500 transition-all duration-500 delay-400 ${
            phase >= 2 ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <span className="inline-flex items-center gap-1">
            <span className="animate-pulse">●</span>
            Loading your dashboard
            <span className="animate-bounce inline-block">...</span>
          </span>
        </p>
      </div>

      {/* Corner decorations */}
      <div className="absolute top-8 left-8 w-20 h-20 border-l-2 border-t-2 border-purple-500/30 rounded-tl-lg"></div>
      <div className="absolute top-8 right-8 w-20 h-20 border-r-2 border-t-2 border-purple-500/30 rounded-tr-lg"></div>
      <div className="absolute bottom-8 left-8 w-20 h-20 border-l-2 border-b-2 border-purple-500/30 rounded-bl-lg"></div>
      <div className="absolute bottom-8 right-8 w-20 h-20 border-r-2 border-b-2 border-purple-500/30 rounded-br-lg"></div>
    </div>
  );
};

export default SplashScreen;
