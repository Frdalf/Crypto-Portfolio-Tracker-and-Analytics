import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const PortfolioValueChart = ({ portfolio, totalValue }) => {
  // Generate simulated historical portfolio data
  // In production, this would come from actual historical data
  const generateHistoricalData = () => {
    const data = [];
    const now = new Date();
    const baseValue = totalValue * 0.95; // Start from 95% of current value
    
    for (let i = 30; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const randomFactor = 1 + (Math.random() - 0.5) * 0.1; // ±5% variation
      const trendFactor = 1 + ((30 - i) / 30) * 0.05; // Slight upward trend
      data.push({
        date: date.toISOString(),
        value: baseValue * randomFactor * trendFactor,
      });
    }
    
    // Ensure last value matches current total
    if (data.length > 0) {
      data[data.length - 1].value = totalValue;
    }
    
    return data;
  };

  const historyData = generateHistoricalData();

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 shadow-lg">
          <p className="text-gray-400 text-sm">{formatDate(label)}</p>
          <p className="text-purple-400 font-semibold">
            ${payload[0].value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
        </div>
      );
    }
    return null;
  };

  const startValue = historyData[0]?.value || 0;
  const change = totalValue - startValue;
  const changePercent = startValue > 0 ? (change / startValue) * 100 : 0;
  const isPositive = change >= 0;

  return (
    <div className="glass rounded-xl p-6 hover-lift transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-pink-400"></div>
            <h3 className="text-lg font-semibold text-white">Portfolio Value (30D)</h3>
          </div>
          <p className={`text-sm flex items-center gap-1 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
            <span className={`inline-block w-0 h-0 border-l-4 border-r-4 border-transparent ${isPositive ? 'border-b-4 border-b-green-400' : 'border-t-4 border-t-red-400'}`}></span>
            {isPositive ? '+' : ''}{changePercent.toFixed(2)}% (${Math.abs(change).toLocaleString('en-US', { minimumFractionDigits: 2 })})
          </p>
        </div>
      </div>

      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={historyData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <defs>
              <linearGradient id="colorPortfolio" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="date" 
              stroke="#94a3b8"
              fontSize={10}
              tickFormatter={formatDate}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
            />
            <YAxis 
              stroke="#94a3b8"
              fontSize={10}
              tickFormatter={(value) => `$${(value / 1000).toFixed(1)}k`}
              tickLine={false}
              axisLine={false}
              domain={['dataMin - 100', 'dataMax + 100']}
              width={50}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#8B5CF6"
              strokeWidth={2}
              fill="url(#colorPortfolio)"
              animationDuration={1000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PortfolioValueChart;
