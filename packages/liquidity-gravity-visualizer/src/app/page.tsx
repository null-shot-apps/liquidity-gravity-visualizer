'use client';

import { useState } from 'react';
import { LiquidityVisualizer } from '@/components/LiquidityVisualizer';
import { TokenInput } from '@/components/TokenInput';
import { ExplainModal } from '@/components/ExplainModal';

export default function Home() {
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [chain, setChain] = useState<'ethereum' | 'base' | 'arbitrum' | 'solana'>('ethereum');
  const [timeframe, setTimeframe] = useState<'15m' | '1h' | '4h' | '1d'>('1h');
  const [showExplain, setShowExplain] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const handleAnalyze = () => {
    if (!tokenSymbol.trim()) return;
    setAnalyzing(true);
    // Simulate analysis delay
    setTimeout(() => setAnalyzing(false), 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-slate-800/50 backdrop-blur-sm bg-slate-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Liquidity Gravity Visualizer
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                Understand where liquidity pressure exists around a token&apos;s price
              </p>
            </div>
            <button
              onClick={() => setShowExplain(true)}
              className="px-4 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 transition-colors text-sm font-medium"
            >
              Explain This
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TokenInput
          tokenSymbol={tokenSymbol}
          setTokenSymbol={setTokenSymbol}
          chain={chain}
          setChain={setChain}
          timeframe={timeframe}
          setTimeframe={setTimeframe}
          onAnalyze={handleAnalyze}
          analyzing={analyzing}
        />

        {analyzing && (
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
              <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
              <span className="text-slate-300">Analyzing liquidity patterns...</span>
            </div>
          </div>
        )}

        {!analyzing && tokenSymbol && (
          <LiquidityVisualizer
            tokenSymbol={tokenSymbol}
            chain={chain}
            timeframe={timeframe}
          />
        )}

        {!tokenSymbol && !analyzing && (
          <div className="mt-16 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-800/50 border border-slate-700/50 mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-slate-300 mb-2">
              Enter a token to begin
            </h2>
            <p className="text-slate-500 max-w-md mx-auto">
              Visualize liquidity gravity zones and understand where price pressure exists
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/50 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div className="text-sm text-slate-300">
                <p className="font-medium text-amber-400 mb-1">Educational Tool Only</p>
                <p className="text-slate-400">
                  This tool visualizes liquidity patterns for situational awareness. 
                  It does not provide price predictions, trading signals, or financial advice.
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {showExplain && <ExplainModal onClose={() => setShowExplain(false)} />}
    </div>
  );
}


