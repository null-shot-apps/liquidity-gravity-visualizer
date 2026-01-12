import { useMemo } from 'react';
import { generateLiquidityData } from '@/lib/liquidityModel';
import { GravityZone } from './GravityZone';
import { DirectionalPull } from './DirectionalPull';
import { InsightCard } from './InsightCard';

interface LiquidityVisualizerProps {
  tokenSymbol: string;
  chain: string;
  timeframe: string;
}

export function LiquidityVisualizer({ tokenSymbol, chain, timeframe }: LiquidityVisualizerProps) {
  const liquidityData = useMemo(
    () => generateLiquidityData(tokenSymbol, chain, timeframe),
    [tokenSymbol, chain, timeframe]
  );

  return (
    <div className="mt-8 space-y-6">
      {/* Current Price & Directional Pull */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-xl p-6">
          <div className="text-sm text-slate-400 mb-1">Current Price</div>
          <div className="text-3xl font-bold text-white mb-1">
            ${liquidityData.currentPrice.toLocaleString()}
          </div>
          <div className="text-sm text-slate-500">
            {tokenSymbol.toUpperCase()} on {chain}
          </div>
        </div>

        <DirectionalPull direction={liquidityData.direction} strength={liquidityData.directionStrength} />
      </div>

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

