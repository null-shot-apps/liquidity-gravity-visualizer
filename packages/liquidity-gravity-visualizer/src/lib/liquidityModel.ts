interface Zone {
  type: 'high' | 'medium' | 'low';
  priceRange: [number, number];
  description: string;
}

interface Insight {
  type: 'info' | 'warning' | 'success';
  title: string;
  message: string;
}

interface LiquidityData {
  currentPrice: number;
  direction: 'up' | 'down' | 'neutral';
  directionStrength: number;
  zones: Zone[];
  insights: Insight[];
  risks: string[];
}

/**
 * Generate realistic liquidity gravity data based on token, chain, and timeframe
 * This is a hybrid model that simulates realistic liquidity patterns
 * In production, this would integrate with real DEX APIs (Uniswap, Jupiter, etc.)
 */
export function generateLiquidityData(
  tokenSymbol: string,
  chain: string,
  timeframe: string
): LiquidityData {
  // Simulate realistic price based on token symbol
  const basePrice = getBasePrice(tokenSymbol);
  const currentPrice = basePrice * (1 + (Math.random() - 0.5) * 0.1); // ±5% variance

  // Generate liquidity zones based on price clustering patterns
  const zones = generateZones(currentPrice, timeframe);

  // Determine directional pull based on zone distribution
  const { direction, strength } = calculateDirectionalPull(zones, currentPrice);

  // Generate contextual insights
  const insights = generateInsights(zones, currentPrice, direction, timeframe);

  // Generate risk warnings
  const risks = generateRisks(zones, currentPrice, direction);

  return {
    currentPrice,
    direction,
    directionStrength: strength,
    zones,
    insights,
    risks
  };
}

function getBasePrice(symbol: string): number {
  const prices: Record<string, number> = {
    'ETH': 3500,
    'BTC': 45000,
    'SOL': 110,
    'USDC': 1,
    'USDT': 1,
    'WETH': 3500,
    'ARB': 2.1,
    'OP': 3.8,
    'MATIC': 0.85,
    'AVAX': 38,
    'LINK': 15,
    'UNI': 7.5,
    'AAVE': 95,
    'CRV': 0.65,
    'MKR': 1800
  };

  const upperSymbol = symbol.toUpperCase();
  return prices[upperSymbol] || 100; // Default to $100 for unknown tokens
}

function generateZones(currentPrice: number, timeframe: string): Zone[] {
  const zones: Zone[] = [];
  
  // Timeframe affects zone width
  const multipliers = {
    '15m': 0.02,  // ±2% zones
    '1h': 0.03,   // ±3% zones
    '4h': 0.05,   // ±5% zones
    '1d': 0.08    // ±8% zones
  };
  
  const mult = multipliers[timeframe as keyof typeof multipliers] || 0.03;

  // Generate zones above and below current price
  // Pattern: Strong liquidity tends to cluster at round numbers and recent price levels
  
  // Zone 1: Below current price (potential support)
  const support1 = currentPrice * (1 - mult * 2);
  const support2 = currentPrice * (1 - mult);
  zones.push({
    type: Math.random() > 0.4 ? 'high' : 'medium',
    priceRange: [support1, support2],
    description: 'Strong liquidity cluster below. May act as support if price drops.'
  });

  // Zone 2: Current price zone
  const current1 = currentPrice * (1 - mult * 0.5);
  const current2 = currentPrice * (1 + mult * 0.5);
  zones.push({
    type: Math.random() > 0.5 ? 'medium' : 'low',
    priceRange: [current1, current2],
    description: 'Current price zone. Liquidity is being actively traded here.'
  });

  // Zone 3: Above current price (potential resistance)
  const resistance1 = currentPrice * (1 + mult);
  const resistance2 = currentPrice * (1 + mult * 2);
  zones.push({
    type: Math.random() > 0.4 ? 'high' : 'medium',
    priceRange: [resistance1, resistance2],
    description: 'Liquidity concentration above. May slow upward movement.'
  });

  // Zone 4: Far above (thin liquidity)
  const far1 = currentPrice * (1 + mult * 2);
  const far2 = currentPrice * (1 + mult * 3.5);
  zones.push({
    type: 'low',
    priceRange: [far1, far2],
    description: 'Thin liquidity zone. Price could move quickly if it reaches here.'
  });

  // Zone 5: Far below (thin liquidity)
  const farBelow1 = currentPrice * (1 - mult * 3.5);
  const farBelow2 = currentPrice * (1 - mult * 2);
  zones.unshift({
    type: 'low',
    priceRange: [farBelow1, farBelow2],
    description: 'Thin liquidity below. Sharp moves possible if price falls here.'
  });

  return zones;
}

function calculateDirectionalPull(zones: Zone[], currentPrice: number): { direction: 'up' | 'down' | 'neutral'; strength: number } {
  let upwardPull = 0;
  let downwardPull = 0;

  zones.forEach(zone => {
    const zoneMid = (zone.priceRange[0] + zone.priceRange[1]) / 2;
    const weight = zone.type === 'high' ? 3 : zone.type === 'medium' ? 2 : 1;

    if (zoneMid > currentPrice) {
      upwardPull += weight;
    } else if (zoneMid < currentPrice) {
      downwardPull += weight;
    }
  });

  const total = upwardPull + downwardPull;
  const netPull = upwardPull - downwardPull;
  const pullRatio = total > 0 ? Math.abs(netPull) / total : 0;

  let direction: 'up' | 'down' | 'neutral';
  let strength: number;

  if (Math.abs(netPull) < 2) {
    direction = 'neutral';
    strength = 30 + Math.random() * 20; // 30-50%
  } else if (netPull > 0) {
    direction = 'up';
    strength = 50 + pullRatio * 50; // 50-100%
  } else {
    direction = 'down';
    strength = 50 + pullRatio * 50; // 50-100%
  }

  return { direction, strength: Math.round(strength) };
}

function generateInsights(zones: Zone[], currentPrice: number, direction: string, timeframe: string): Insight[] {
  const insights: Insight[] = [];

  // Find current zone
  const currentZone = zones.find(z => currentPrice >= z.priceRange[0] && currentPrice <= z.priceRange[1]);

  if (currentZone) {
    if (currentZone.type === 'low') {
      insights.push({
        type: 'warning',
        title: 'Low Liquidity Environment',
        message: 'Price is currently in a low-liquidity zone. Small trades may cause large moves. Expect higher volatility.'
      });
    } else if (currentZone.type === 'high') {
      insights.push({
        type: 'info',
        title: 'High Liquidity Zone',
        message: 'Price is in a thick liquidity area. Movement may be slower and more stable here.'
      });
    }
  }

  // Directional insight
  if (direction === 'up') {
    insights.push({
      type: 'success',
      title: 'Upward Pressure Detected',
      message: 'Liquidity distribution suggests upward attraction. Strong liquidity sits above current price, potentially pulling price higher.'
    });
  } else if (direction === 'down') {
    insights.push({
      type: 'warning',
      title: 'Downward Pressure Detected',
      message: 'Liquidity concentration below current price may act as a gravity well, pulling price downward.'
    });
  } else {
    insights.push({
      type: 'info',
      title: 'Balanced Liquidity',
      message: 'Liquidity is relatively balanced above and below. Price may consolidate or chop in this range.'
    });
  }

  // Timeframe-specific insight
  if (timeframe === '15m' || timeframe === '1h') {
    insights.push({
      type: 'info',
      title: 'Short-Term View',
      message: 'This is a short-term snapshot. Liquidity patterns can shift quickly. Use for immediate situational awareness.'
    });
  } else {
    insights.push({
      type: 'info',
      title: 'Longer-Term View',
      message: 'This timeframe shows broader liquidity structure. Patterns here tend to be more stable but less precise for immediate moves.'
    });
  }

  return insights.slice(0, 4); // Return max 4 insights
}

function generateRisks(zones: Zone[], currentPrice: number, direction: string): string[] {
  const risks: string[] = [];

  const lowLiqZones = zones.filter(z => z.type === 'low');
  const currentZone = zones.find(z => currentPrice >= z.priceRange[0] && currentPrice <= z.priceRange[1]);

  if (currentZone?.type === 'low') {
    risks.push('Slippage Risk: Current low liquidity may cause significant slippage on larger trades');
  }

  if (direction === 'neutral') {
    risks.push('Chop Risk: Balanced liquidity may lead to sideways, choppy price action');
  }

  if (lowLiqZones.length > 2) {
    risks.push('Sudden Move Risk: Multiple thin liquidity zones nearby increase volatility potential');
  }

  risks.push('Market Risk: External factors (news, macro events) can override liquidity patterns');
  risks.push('Data Lag: Liquidity can shift rapidly. This is a snapshot, not a prediction');

  return risks;
}

