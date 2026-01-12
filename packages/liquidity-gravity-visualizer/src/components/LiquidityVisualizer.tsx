import { useEffect, useState } from 'react';
import { generateLiquidityData, type LiquidityData } from '@/lib/liquidityModel';
import { GravityZone } from './GravityZone';
import { DirectionalPull } from './DirectionalPull';
import { InsightCard } from './InsightCard';

interface LiquidityVisualizerProps {
  tokenSymbol: string;
  chain: string;
  timeframe: string;
}

export function LiquidityVisualizer({ tokenSymbol, chain, timeframe }: LiquidityVisualizerProps) {
  const [liquidityData, setLiquidityData] = useState<LiquidityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    
    async function fetchData() {
      setLoading(true);
      setError(null);
      
      try {
        const data = await generateLiquidityData(tokenSymbol, chain, timeframe);
        if (mounted) {
          setLiquidityData(data);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to load token data');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }
    
    fetchData();
    
    return () => {
      mounted = false;
    };
  }, [tokenSymbol, chain, timeframe]);

  if (loading) {
    return (
      <div className="mt-8 text-center">
        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
          <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-slate-300">Loading token data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8">
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div>
              <h3 className="text-sm font-semibold text-red-400 mb-1">Token Not Found</h3>
              <p className="text-sm text-slate-400">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!liquidityData) {
    return null;
  }

  return (
    <div className="mt-8 space-y-6">
      {/* Token Info & Current Price */}
      {liquidityData.tokenData && (
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-xl p-6">
          <div className="flex items-center gap-4 mb-4">
            <img 
              src={liquidityData.tokenData.metadata.logo} 
              alt={liquidityData.tokenData.metadata.name}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <h2 className="text-xl font-bold text-white">
                {liquidityData.tokenData.metadata.name}
              </h2>
              <p className="text-sm text-slate-400">
                {liquidityData.tokenData.metadata.symbol} on {chain}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-xs text-slate-500 mb-1">Current Price</div>
              <div className="text-lg font-semibold text-white">
                ${liquidityData.currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500 mb-1">24h Change</div>
              <div className={`text-lg font-semibold ${liquidityData.tokenData.price.percent_change_24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {liquidityData.tokenData.price.percent_change_24h >= 0 ? '+' : ''}
                {liquidityData.tokenData.price.percent_change_24h.toFixed(2)}%
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500 mb-1">24h Volume</div>
              <div className="text-lg font-semibold text-white">
                ${(liquidityData.tokenData.price.volume_24h / 1000000).toFixed(2)}M
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500 mb-1">Market Cap</div>
              <div className="text-lg font-semibold text-white">
                ${(liquidityData.tokenData.price.market_cap / 1000000000).toFixed(2)}B
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Directional Pull */}
      <DirectionalPull direction={liquidityData.direction} strength={liquidityData.directionStrength} />

      {/* Gravity Zones Visualization */}
      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Liquidity Gravity Zones</h2>
        <div className="space-y-3">
          {liquidityData.zones.map((zone, idx) => (
            <GravityZone key={idx} zone={zone} currentPrice={liquidityData.currentPrice} />
          ))}
        </div>
      </div>

      {/* Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {liquidityData.insights.map((insight, idx) => (
          <InsightCard key={idx} insight={insight} />
        ))}
      </div>

      {/* Risk Awareness */}
      <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <div>
            <h3 className="text-sm font-semibold text-amber-400 mb-2">Risk Awareness</h3>
            <ul className="space-y-1 text-sm text-slate-400">
              {liquidityData.risks.map((risk, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-amber-400 mt-0.5">•</span>
                  <span>{risk}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}



