interface TokenInputProps {
  tokenSymbol: string;
  setTokenSymbol: (value: string) => void;
  chain: 'ethereum' | 'base' | 'arbitrum' | 'solana';
  setChain: (value: 'ethereum' | 'base' | 'arbitrum' | 'solana') => void;
  timeframe: '15m' | '1h' | '4h' | '1d';
  setTimeframe: (value: '15m' | '1h' | '4h' | '1d') => void;
  onAnalyze: () => void;
  analyzing: boolean;
}

export function TokenInput({
  tokenSymbol,
  setTokenSymbol,
  chain,
  setChain,
  timeframe,
  setTimeframe,
  onAnalyze,
  analyzing
}: TokenInputProps) {
  const chains = [
    { value: 'ethereum', label: 'Ethereum' },
    { value: 'base', label: 'Base' },
    { value: 'arbitrum', label: 'Arbitrum' },
    { value: 'solana', label: 'Solana' }
  ] as const;

  const timeframes = [
    { value: '15m', label: '15 min' },
    { value: '1h', label: '1 hour' },
    { value: '4h', label: '4 hours' },
    { value: '1d', label: '1 day' }
  ] as const;

  return (
    <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-xl p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Token Input */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Token Symbol or Address
          </label>
          <input
            type="text"
            value={tokenSymbol}
            onChange={(e) => setTokenSymbol(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onAnalyze()}
            placeholder="e.g., ETH, USDC, 0x..."
            className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
          />
        </div>

        {/* Chain Selector */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Chain
          </label>
          <select
            value={chain}
            onChange={(e) => setChain(e.target.value as any)}
            className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all appearance-none cursor-pointer"
          >
            {chains.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        {/* Timeframe Selector */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Timeframe
          </label>
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value as any)}
            className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all appearance-none cursor-pointer"
          >
            {timeframes.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Analyze Button */}
      <div className="mt-4">
        <button
          onClick={onAnalyze}
          disabled={!tokenSymbol.trim() || analyzing}
          className="w-full md:w-auto px-8 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed rounded-lg font-medium transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30"
        >
          {analyzing ? 'Analyzing...' : 'Analyze Liquidity'}
        </button>
      </div>
    </div>
  );
}

