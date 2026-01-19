import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const PerformanceBarChart = ({ portfolio = [] }) => {
  // Safe check for portfolio
  const safePortfolio = Array.isArray(portfolio) ? portfolio : [];
  
  if (safePortfolio.length === 0) {
    return null;
  }

  const data = safePortfolio.map(token => ({
    name: token?.symbol || 'Unknown',
    change: parseFloat(token?.change24h) || 0,
    value: parseFloat(token?.value) || 0,
  })).sort((a, b) => b.change - a.change);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 shadow-lg">
          <p className="font-semibold text-white">{item.name}</p>
          <p className={item.change >= 0 ? 'text-green-400' : 'text-red-400'}>
            {item.change >= 0 ? '+' : ''}{item.change.toFixed(2)}%
          </p>
          <p className="text-gray-400 text-sm">
            Value: ${item.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass rounded-xl p-6 hover-lift transition-all duration-300">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full bg-green-400"></div>
        <h3 className="text-lg font-semibold text-white">24h Performance</h3>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={true} vertical={false} />
            <XAxis 
              type="number" 
              stroke="#94a3b8"
              fontSize={12}
              tickFormatter={(value) => `${value}%`}
              domain={['dataMin - 1', 'dataMax + 1']}
            />
            <YAxis 
              type="category" 
              dataKey="name" 
              stroke="#94a3b8"
              fontSize={12}
              width={50}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(139, 92, 246, 0.1)' }} />
            <Bar dataKey="change" radius={[0, 4, 4, 0]} maxBarSize={30}>
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.change >= 0 ? '#10B981' : '#EF4444'} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PerformanceBarChart;
