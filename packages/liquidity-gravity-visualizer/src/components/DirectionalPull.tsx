interface DirectionalPullProps {
  direction: 'up' | 'down' | 'neutral';
  strength: number; // 0-100
}

export function DirectionalPull({ direction, strength }: DirectionalPullProps) {
  const config = {
    up: {
      label: 'Liquidity pressure favors upward movement',
      icon: '↑',
      color: 'text-green-400',
      bg: 'bg-green-500/10',
      border: 'border-green-500/30'
    },
    down: {
      label: 'Liquidity pressure favors downward movement',
      icon: '↓',
      color: 'text-red-400',
      bg: 'bg-red-500/10',
      border: 'border-red-500/30'
    },
    neutral: {
      label: 'Liquidity balanced — no dominant pull',
      icon: '↔',
      color: 'text-slate-400',
      bg: 'bg-slate-500/10',
      border: 'border-slate-500/30'
    }
  };

  const style = config[direction];

  return (
    <div className={`${style.bg} border ${style.border} rounded-xl p-6`}>
      <div className="text-sm text-slate-400 mb-3">Directional Pull</div>
      <div className="flex items-center gap-3 mb-4">
        <div className={`text-4xl ${style.color}`}>{style.icon}</div>
        <div className={`text-lg font-semibold ${style.color}`}>
          {style.label}
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-400">Strength</span>
          <span className={`font-medium ${style.color}`}>{strength}%</span>
        </div>
        <div className="w-full bg-slate-800/50 rounded-full h-2 overflow-hidden">
          <div
            className={`h-full ${direction === 'up' ? 'bg-green-500' : direction === 'down' ? 'bg-red-500' : 'bg-slate-500'} transition-all duration-500`}
            style={{ width: `${strength}%` }}
          />
        </div>
      </div>
    </div>
  );
}

