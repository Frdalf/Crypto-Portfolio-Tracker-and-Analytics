import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { getPriceHistory } from '../../services/priceService';

const PriceHistoryChart = ({ tokenId = 'ethereum', tokenSymbol = 'ETH', days = 7 }) => {
  const [priceData, setPriceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDays, setSelectedDays] = useState(days);

  useEffect(() => {
    const fetchPriceHistory = async () => {
      setLoading(true);
      try {
        const data = await getPriceHistory(tokenId, selectedDays);
        setPriceData(data);
      } catch (error) {
        console.error('Failed to fetch price history:', error);
        // Generate demo data if API fails
        const demoData = generateDemoData(selectedDays);
        setPriceData(demoData);
      } finally {
        setLoading(false);
      }
    };

    fetchPriceHistory();
  }, [tokenId, selectedDays]);

  const generateDemoData = (days) => {
    const data = [];
    const now = new Date();
    const basePrice = 2300;
    
    for (let i = days; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const randomChange = (Math.random() - 0.5) * 200;
      data.push({
        timestamp: date,
        price: basePrice + randomChange + (days - i) * 10,
      });
    }
    return data;
  };

  const formatDate = (date) => {
    if (selectedDays <= 1) {
      return new Date(date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 shadow-lg">
          <p className="text-gray-400 text-sm">{formatDate(label)}</p>
          <p className="text-purple-400 font-semibold">
            ${payload[0].value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
      );
    }
    return null;
  };

  const priceChange = priceData.length > 1 
    ? ((priceData[priceData.length - 1]?.price - priceData[0]?.price) / priceData[0]?.price * 100)
    : 0;

  const isPositive = priceChange >= 0;

  return (
    <div className="glass rounded-xl p-6 hover-lift transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-blue-400"></div>
            <h3 className="text-lg font-semibold text-white">{tokenSymbol} Price History</h3>
          </div>
          <p className={`text-sm flex items-center gap-1 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
            <span className={`inline-block w-0 h-0 border-l-4 border-r-4 border-transparent ${isPositive ? 'border-b-4 border-b-green-400' : 'border-t-4 border-t-red-400'}`}></span>
            {isPositive ? '+' : ''}{priceChange.toFixed(2)}% ({selectedDays}d)
          </p>
        </div>
        <div className="flex gap-1 p-1 rounded-lg bg-slate-700/50">
          {[1, 7, 30, 90].map((d) => (
            <button
              key={d}
              onClick={() => setSelectedDays(d)}
              className={`px-3 py-1.5 text-sm rounded-md transition-all duration-200 ${
                selectedDays === d
                  ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/25'
                  : 'text-gray-400 hover:text-white hover:bg-slate-600/50'
              }`}
            >
              {d}D
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="w-10 h-10 rounded-full border-4 border-purple-500/20 border-t-purple-500 animate-spin"></div>
        </div>
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={priceData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={isPositive ? '#10B981' : '#EF4444'} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={isPositive ? '#10B981' : '#EF4444'} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis 
                dataKey="timestamp" 
                stroke="#94a3b8"
                fontSize={11}
                tickFormatter={formatDate}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="#94a3b8"
                fontSize={11}
                tickFormatter={(value) => `$${value.toLocaleString()}`}
                tickLine={false}
                axisLine={false}
                domain={['dataMin - 50', 'dataMax + 50']}
                width={70}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="price" 
                stroke={isPositive ? '#10B981' : '#EF4444'}
                strokeWidth={2}
                fill="url(#colorPrice)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default PriceHistoryChart;
