import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = ['#8B5CF6', '#EC4899', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#6366F1', '#14B8A6'];

const PortfolioPieChart = ({ portfolio = [] }) => {
  // Safe check for portfolio
  const safePortfolio = Array.isArray(portfolio) ? portfolio : [];
  
  if (safePortfolio.length === 0) {
    return null;
  }

  const data = safePortfolio.map((token, index) => ({
    name: token?.symbol || 'Unknown',
    value: parseFloat(token?.value) || 0,
    color: COLORS[index % COLORS.length],
  })).filter(item => item.value > 0);

  if (data.length === 0) {
    return null;
  }

  const totalValue = data.reduce((sum, item) => sum + item.value, 0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      const percentage = totalValue > 0 ? ((item.value / totalValue) * 100).toFixed(1) : 0;
      return (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 shadow-lg">
          <p className="font-semibold text-white">{item.name}</p>
          <p className="text-purple-400">${item.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
          <p className="text-gray-400 text-sm">{percentage}% of portfolio</p>
        </div>
      );
    }
    return null;
  };

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
    if (percent < 0.05) return null; // Don't show label if less than 5%
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        className="text-xs font-semibold"
      >
        {name}
      </text>
    );
  };

  return (
    <div className="glass rounded-xl p-6 hover-lift transition-all duration-300">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full bg-purple-400"></div>
        <h3 className="text-lg font-semibold text-white">Portfolio Allocation</h3>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomLabel}
              outerRadius={100}
              innerRadius={40}
              paddingAngle={2}
              dataKey="value"
              animationBegin={0}
              animationDuration={800}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-4 justify-center">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors cursor-default">
            <div
              className="w-3 h-3 rounded-full shadow-lg"
              style={{ backgroundColor: item.color, boxShadow: `0 0 10px ${item.color}50` }}
            />
            <span className="text-sm text-gray-300 font-medium">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PortfolioPieChart;
