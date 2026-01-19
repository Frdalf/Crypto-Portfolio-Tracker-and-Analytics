import React, { useState, useEffect } from 'react';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  ExternalLink, 
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Filter,
  Clock,
  CheckCircle,
  XCircle,
  Coins
} from 'lucide-react';
import { getAllTransactions, getDemoTransactions } from '../services/transactionService';
import { EXPLORER_APIS } from '../config/api';

const TransactionHistory = ({ walletAddress, chain, useRealData }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all'); // all, in, out, tokens
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    if (walletAddress) {
      fetchTransactions();
    }
  }, [walletAddress, chain, useRealData, page]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      if (useRealData) {
        const txs = await getAllTransactions(walletAddress, chain, page, 25);
        setTransactions(txs);
      } else {
        // Demo mode
        setTransactions(getDemoTransactions());
      }
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = transactions.filter(tx => {
    if (filter === 'all') return true;
    if (filter === 'in') return tx.direction === 'in';
    if (filter === 'out') return tx.direction === 'out';
    if (filter === 'tokens') return tx.type === 'token_transfer';
    return true;
  });

  const formatAddress = (address) => {
    if (!address) return '-';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatDate = (date) => {
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      const hours = Math.floor(diff / (1000 * 60 * 60));
      if (hours === 0) {
        const minutes = Math.floor(diff / (1000 * 60));
        return `${minutes}m ago`;
      }
      return `${hours}h ago`;
    }
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days}d ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  const formatValue = (value) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(2)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(2)}K`;
    if (value >= 1) return value.toFixed(4);
    if (value >= 0.0001) return value.toFixed(6);
    return value.toExponential(2);
  };

  const getExplorerUrl = (hash) => {
    const explorer = EXPLORER_APIS[chain];
    if (!explorer) return '#';
    
    const baseUrls = {
      ethereum: 'https://etherscan.io',
      polygon: 'https://polygonscan.com',
      bsc: 'https://bscscan.com',
    };
    
    return `${baseUrls[chain]}/tx/${hash}`;
  };

  const StatusIcon = ({ status }) => {
    if (status === 'success') {
      return <CheckCircle className="w-4 h-4 text-green-400" />;
    }
    if (status === 'failed') {
      return <XCircle className="w-4 h-4 text-red-400" />;
    }
    return <Clock className="w-4 h-4 text-yellow-400 animate-pulse" />;
  };

  return (
    <div className="glass rounded-xl p-6 mt-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-purple-500/20">
            <Clock className="w-5 h-5 text-purple-400" />
          </div>
          <h3 className="text-lg font-semibold text-white">Transaction History</h3>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Filter Buttons */}
          <div className="flex glass rounded-lg p-1">
            {[
              { key: 'all', label: 'All' },
              { key: 'in', label: 'In' },
              { key: 'out', label: 'Out' },
              { key: 'tokens', label: 'Tokens' },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-3 py-1 text-xs rounded-md transition-all ${
                  filter === key
                    ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/25'
                    : 'text-gray-400 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          
          {/* Refresh Button */}
          <button
            onClick={fetchTransactions}
            disabled={loading}
            className="group p-2 rounded-lg glass hover:bg-purple-500/20 transition-all duration-300 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 transition-all duration-300 ${loading ? 'animate-spin text-purple-400' : 'group-hover:text-purple-400'}`} />
          </button>
        </div>
      </div>

      {/* Transaction List */}
      {loading && transactions.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <div className="relative">
            <div className="w-12 h-12 rounded-full border-4 border-purple-500/20 border-t-purple-500 animate-spin"></div>
          </div>
        </div>
      ) : filteredTransactions.length === 0 ? (
        <div className="text-center py-12 text-gray-400 animate-fade-in-scale">
          <div className="relative inline-block mb-4">
            <div className="absolute inset-0 bg-slate-500 blur-2xl opacity-10"></div>
            <Coins className="relative w-14 h-14 mx-auto opacity-50 animate-float" />
          </div>
          <p className="font-medium">No transactions found</p>
          <p className="text-sm mt-1 text-gray-500">
            {useRealData ? 'Try switching to Demo mode to see sample data' : 'No demo transactions available'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTransactions.map((tx, index) => (
            <div
              key={tx.hash + index}
              className={`group glass rounded-xl overflow-hidden transition-all duration-300 hover:border-purple-500/30 animate-fade-in-up ${
                expanded === index ? 'ring-2 ring-purple-500/50 shadow-lg shadow-purple-500/10' : ''
              }`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Main Row */}
              <div
                className="p-4 cursor-pointer hover:bg-slate-700/30 transition-all duration-300"
                onClick={() => setExpanded(expanded === index ? null : index)}
              >
                <div className="flex items-center gap-4">
                  {/* Direction Icon */}
                  <div className={`p-2.5 rounded-xl transition-transform duration-300 group-hover:scale-110 ${
                    tx.direction === 'in' 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {tx.direction === 'in' 
                      ? <ArrowDownLeft className="w-5 h-5" />
                      : <ArrowUpRight className="w-5 h-5" />
                    }
                  </div>

                  {/* Transaction Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-white">
                        {tx.direction === 'in' ? 'Received' : 'Sent'}
                      </span>
                      {tx.type === 'token_transfer' && (
                        <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full font-medium">
                          Token
                        </span>
                      )}
                      {tx.isContract && (
                        <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full font-medium">
                          Contract
                        </span>
                      )}
                      <StatusIcon status={tx.status} />
                    </div>
                    <p className="text-sm text-gray-400 truncate">
                      {tx.direction === 'in' ? 'From: ' : 'To: '}
                      {formatAddress(tx.direction === 'in' ? tx.from : tx.to)}
                    </p>
                  </div>

                  {/* Value */}
                  <div className="text-right">
                    <p className={`font-semibold ${
                      tx.direction === 'in' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {tx.direction === 'in' ? '+' : '-'}{formatValue(tx.value)} {tx.symbol}
                    </p>
                    <p className="text-xs text-gray-500">{formatDate(tx.timestamp)}</p>
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {expanded === index && (
                <div className="px-4 pb-4 pt-2 border-t border-slate-600/50 bg-slate-800/30">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Transaction Hash</p>
                      <p className="text-gray-300 font-mono text-xs truncate">{tx.hash}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Block</p>
                      <p className="text-gray-300">{tx.blockNumber}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">From</p>
                      <p className="text-gray-300 font-mono text-xs">{formatAddress(tx.from)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">To</p>
                      <p className="text-gray-300 font-mono text-xs">{formatAddress(tx.to)}</p>
                    </div>
                    {tx.gasFee && (
                      <div>
                        <p className="text-gray-500">Gas Fee</p>
                        <p className="text-gray-300">{tx.gasFee.toFixed(6)} ETH</p>
                      </div>
                    )}
                    {tx.functionName && (
                      <div>
                        <p className="text-gray-500">Method</p>
                        <p className="text-gray-300 text-xs truncate">{tx.functionName}</p>
                      </div>
                    )}
                    {tx.tokenName && (
                      <div>
                        <p className="text-gray-500">Token</p>
                        <p className="text-gray-300">{tx.tokenName}</p>
                      </div>
                    )}
                  </div>
                  
                  <a
                    href={getExplorerUrl(tx.hash)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    View on Explorer
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {filteredTransactions.length > 0 && useRealData && (
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-700">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1 || loading}
            className="flex items-center gap-1 px-3 py-2 rounded-lg bg-slate-700/50 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>
          
          <span className="text-gray-400 text-sm">Page {page}</span>
          
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={filteredTransactions.length < 25 || loading}
            className="flex items-center gap-1 px-3 py-2 rounded-lg bg-slate-700/50 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;
