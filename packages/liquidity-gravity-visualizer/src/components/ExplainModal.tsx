interface ExplainModalProps {
  onClose: () => void;
}

export function ExplainModal({ onClose }: ExplainModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Understanding Liquidity Gravity</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* What is Liquidity Gravity */}
          <section>
            <h3 className="text-lg font-semibold text-blue-400 mb-3">
              What is liquidity gravity?
            </h3>
            <p className="text-slate-300 leading-relaxed mb-3">
              Think of liquidity like mass in space. Just as planets create gravitational pull, 
              large pools of liquidity create &quot;gravity wells&quot; that attract price movement.
            </p>
            <p className="text-slate-300 leading-relaxed">
              When there&apos;s a lot of liquidity at a certain price level, it acts like a magnet — 
              price tends to slow down, pause, or even reverse when it reaches these zones.
            </p>
          </section>

          {/* Why Price Moves Faster in Low Liquidity */}
          <section className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-red-400 mb-3">
              Why does price move faster in low liquidity?
            </h3>
            <p className="text-slate-300 leading-relaxed mb-3">
              Imagine pushing a shopping cart through an empty parking lot versus a crowded store. 
              In the empty lot (low liquidity), you can move fast with little resistance.
            </p>
            <p className="text-slate-300 leading-relaxed">
              In low liquidity zones, small trades can cause large price swings because there aren&apos;t 
              enough buyers or sellers to absorb the pressure. This creates volatility and unpredictability.
            </p>
          </section>

          {/* Why Price Stalls in High Liquidity */}
          <section className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-blue-400 mb-3">
              Why does price stall in high liquidity zones?
            </h3>
            <p className="text-slate-300 leading-relaxed mb-3">
              High liquidity zones are like thick mud — they slow everything down. When there&apos;s a lot 
              of capital sitting at a price level, it takes much more buying or selling pressure to 
              push through.
            </p>
            <p className="text-slate-300 leading-relaxed">
              These zones often act as support (below price) or resistance (above price). Price may 
              bounce off them, consolidate, or need significant volume to break through.
            </p>
          </section>

          {/* The Three Gravity Zones */}
          <section>
            <h3 className="text-lg font-semibold text-white mb-4">
              The Three Gravity Zones
            </h3>
            <div className="space-y-3">
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">🔵</span>
                  <span className="font-semibold text-blue-400">Strong Gravity</span>
                </div>
                <p className="text-sm text-slate-300">
                  Thick liquidity. Price likely to slow, pause, or reverse. Acts like a magnet pulling price toward it.
                </p>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">🟡</span>
                  <span className="font-semibold text-yellow-400">Medium Gravity</span>
                </div>
                <p className="text-sm text-slate-300">
                  Transitional area. Price may chop or consolidate. Moderate resistance to movement.
                </p>
              </div>

              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">🔴</span>
                  <span className="font-semibold text-red-400">Weak Gravity</span>
                </div>
                <p className="text-sm text-slate-300">
                  Thin liquidity. Price can move quickly and unpredictably. High volatility risk.
                </p>
              </div>
            </div>
          </section>

          {/* Important Reminder */}
          <section className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div>
                <h4 className="text-sm font-semibold text-amber-400 mb-1">Remember</h4>
                <p className="text-sm text-slate-300">
                  This tool shows you where liquidity exists and how it might influence price behavior. 
                  It does NOT predict where price will go or tell you when to buy or sell. 
                  Use it to understand the environment, not to make trading decisions.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-slate-900 border-t border-slate-800 px-6 py-4">
          <button
            onClick={onClose}
            className="w-full px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-lg font-medium transition-all"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
}



