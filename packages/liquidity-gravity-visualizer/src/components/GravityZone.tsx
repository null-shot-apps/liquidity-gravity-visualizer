interface Zone {
  type: 'high' | 'medium' | 'low';
  priceRange: [number, number];
  description: string;
}

interface GravityZoneProps {
  zone: Zone;
  currentPrice: number;
}

export function GravityZone({ zone, currentPrice }: GravityZoneProps) {
  const isCurrentZone = currentPrice >= zone.priceRange[0] && currentPrice <= zone.priceRange[1];
  
  const colors = {
    high: {
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/30',
      text: 'text-blue-400',
      icon: '🔵',
      label: 'Strong Gravity'
    },
    medium: {
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/30',
      text: 'text-yellow-400',
      icon: '🟡',
      label: 'Medium Gravity'
    },
    low: {
      bg: 'bg-red-500/10',
      border: 'border-red-500/30',
      text: 'text-red-400',
      icon: '🔴',
      label: 'Weak Gravity'
    }
  };

  const style = colors[zone.type];

  return (
    <div className={`${style.bg} border ${style.border} rounded-lg p-4 transition-all ${isCurrentZone ? 'ring-2 ring-white/20' : ''}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">{style.icon}</span>
            <span className={`text-sm font-semibold ${style.text}`}>
              {style.label}
            </span>
            {isCurrentZone && (
              <span className="text-xs px-2 py-0.5 bg-white/10 rounded-full text-white">
                Current Zone
              </span>
            )}
          </div>
          <div className="text-sm text-slate-300 mb-1">
            ${zone.priceRange[0].toLocaleString()} - ${zone.priceRange[1].toLocaleString()}
          </div>
          <div className="text-sm text-slate-400">
            {zone.description}
          </div>
        </div>
      </div>
    </div>
  );
}

