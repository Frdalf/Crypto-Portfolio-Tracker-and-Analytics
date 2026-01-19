import React from 'react';
import { PieChart, TrendingUp, BarChart3, Zap } from 'lucide-react';

const QuickStats = ({ portfolio = [] }) => {
  // Safely handle empty or undefined portfolio
  const safePortfolio = Array.isArray(portfolio) ? portfolio : [];
  
  // Find best performer with safe access
  const bestPerformer = safePortfolio.length > 0 
    ? safePortfolio.reduce((best, token) => {
        const tokenChange = token?.change24h ?? -Infinity;
        const bestChange = best?.change24h ?? -Infinity;
        return tokenChange > bestChange ? token : best;
      }, null)
    : null;

  // Calculate total 24h change (weighted average) with safe access
  const totalChange = safePortfolio.length > 0 
    ? safePortfolio.reduce((sum, token) => sum + (token?.change24h ?? 0), 0) / safePortfolio.length 
    : 0;

  const stats = [
    {
      icon: PieChart,
      iconColor: 'text-purple-400',
      bgColor: 'bg-purple-500/20',
      title: 'Assets',
      value: safePortfolio.length,
      subtitle: 'Different tokens',
    },
    {
      icon: TrendingUp,
      iconColor: totalChange >= 0 ? 'text-green-400' : 'text-red-400',
      bgColor: totalChange >= 0 ? 'bg-green-500/20' : 'bg-red-500/20',
      title: '24h Change',
      value: `${totalChange >= 0 ? '+' : ''}${totalChange.toFixed(1)}%`,
      valueColor: totalChange >= 0 ? 'text-green-400' : 'text-red-400',
      subtitle: 'Portfolio performance',
    },
    {
      icon: Zap,
      iconColor: 'text-yellow-400',
      bgColor: 'bg-yellow-500/20',
      title: 'Best Performer',
      value: bestPerformer?.symbol || '-',
      subtitle: bestPerformer ? `${(bestPerformer?.change24h ?? 0) >= 0 ? '+' : ''}${(bestPerformer?.change24h ?? 0).toFixed(1)}% today` : 'No data',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
      {stats.map((stat, index) => (
        <div 
          key={index}
          className="group glass rounded-xl p-6 hover-lift animate-fade-in-up"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-2 rounded-lg ${stat.bgColor} group-hover:scale-110 transition-transform duration-300`}>
              <stat.icon className={stat.iconColor} size={22} />
            </div>
            <h3 className="font-semibold text-gray-300">{stat.title}</h3>
          </div>
          <p className={`text-3xl font-bold mb-1 ${stat.valueColor || 'text-white'} group-hover:scale-105 transition-transform duration-300 origin-left`}>
            {stat.value}
          </p>
          <p className="text-sm text-gray-500">{stat.subtitle}</p>
          
          {/* Decorative line */}
          <div className="mt-4 h-1 rounded-full bg-slate-700/50 overflow-hidden">
            <div 
              className={`h-full rounded-full ${stat.bgColor} transition-all duration-500 group-hover:w-full`}
              style={{ width: '60%' }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuickStats;
