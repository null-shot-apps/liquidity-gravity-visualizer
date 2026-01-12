import { cmcService, type TokenData } from './coinmarketcap';

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

export interface LiquidityData {
  currentPrice: number;
  direction: 'up' | 'down' | 'neutral';
  directionStrength: number;
  zones: Zone[];
  insights: Insight[];
  risks: string[];
  tokenData?: TokenData;
}

/**
 * Generate realistic liquidity gravity data based on token, chain, and timeframe
 * Integrates with CoinMarketCap for real token data and prices
 * Uses hybrid model: real price data + simulated liquidity patterns
 */
export async function generateLiquidityData(
  tokenSymbol: string,
  chain: string,
  timeframe: string
): Promise<LiquidityData> {
  // Fetch real token data from CoinMarketCap
  const tokenData = await cmcService.getTokenData(tokenSymbol, chain);
  
  if (!tokenData) {
    throw new Error(`Token ${tokenSymbol} not found on ${chain}`);
  }

  // Use real current price from CoinMarketCap
  const currentPrice = tokenData.price.price;

  // Generate liquidity zones based on price clustering patterns
  // Enhanced with volume and volatility data from CMC
  const zones = generateZones(currentPrice, timeframe, tokenData);

  // Determine directional pull based on zone distribution and price momentum
  const { direction, strength } = calculateDirectionalPull(zones, currentPrice, tokenData);

  // Generate contextual insights
  const insights = generateInsights(zones, currentPrice, direction, timeframe, tokenData);

  // Generate risk warnings
  const risks = generateRisks(zones, currentPrice, direction, tokenData);

  return {
    currentPrice,
    direction,
    directionStrength: strength,
    zones,
    insights,
    risks,
    tokenData
  };
}

function generateZones(currentPrice: number, timeframe: string, tokenData?: TokenData): Zone[] {
  const zones: Zone[] = [];
  
  // Timeframe affects zone width
  const multipliers = {
    '15m': 0.02,  // ±2% zones
    '1h': 0.03,   // ±3% zones
    '4h': 0.05,   // ±5% zones
    '1d': 0.08    // ±8% zones
  };
  
  let mult = multipliers[timeframe as keyof typeof multipliers] || 0.03;
  
  // Adjust zone width based on token volatility (from CMC data)
  if (tokenData) {
    const volatility = Math.abs(tokenData.price.percent_change_24h);
    if (volatility > 10) {
      mult *= 1.5; // Wider zones for volatile tokens
    } else if (volatility < 2) {
      mult *= 0.7; // Tighter zones for stable tokens
    }
  }

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

function calculateDirectionalPull(zones: Zone[], currentPrice: number, tokenData?: TokenData): { direction: 'up' | 'down' | 'neutral'; strength: number } {
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
  let netPull = upwardPull - downwardPull;
  
  // Factor in price momentum from CMC data
  if (tokenData) {
    const momentum = tokenData.price.percent_change_1h;
    if (momentum > 1) {
      netPull += 1; // Boost upward pull
    } else if (momentum < -1) {
      netPull -= 1; // Boost downward pull
    }
  }
  
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

function generateInsights(zones: Zone[], currentPrice: number, direction: string, timeframe: string, tokenData?: TokenData): Insight[] {
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

  // Volume-based insight
  if (tokenData) {
    const volumeChange = tokenData.price.volume_change_24h;
    if (Math.abs(volumeChange) > 50) {
      insights.push({
        type: 'warning',
        title: volumeChange > 0 ? 'Volume Surge Detected' : 'Volume Drop Detected',
        message: `24h volume ${volumeChange > 0 ? 'increased' : 'decreased'} by ${Math.abs(volumeChange).toFixed(1)}%. ${volumeChange > 0 ? 'Increased activity may signal shifting liquidity.' : 'Lower volume may mean thinner liquidity.'}`
      });
    }
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

function generateRisks(zones: Zone[], currentPrice: number, direction: string, tokenData?: TokenData): string[] {
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
  
  // Add volatility-based risk from CMC data
  if (tokenData) {
    const volatility = Math.abs(tokenData.price.percent_change_24h);
    if (volatility > 15) {
      risks.push(`High Volatility: Token moved ${volatility.toFixed(1)}% in 24h. Expect continued large swings`);
    }
  }

  risks.push('Market Risk: External factors (news, macro events) can override liquidity patterns');
  risks.push('Data Lag: Liquidity can shift rapidly. This is a snapshot, not a prediction');

  return risks;
}











