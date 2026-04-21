/**
 * Market Analysis Engine
 * Analyzes collected data to generate short-term and long-term outlook signals.
 * Uses momentum, sentiment, cross-market correlation, and trend analysis.
 */

// ===== Signal Constants =====
const SIGNAL = {
  STRONG_BULL: { label: 'Strong Bullish', icon: '🟢', color: '#00e676', score: 2 },
  BULL: { label: 'Bullish', icon: '🟩', color: '#69f0ae', score: 1 },
  NEUTRAL: { label: 'Neutral', icon: '🟨', color: '#ffd740', score: 0 },
  BEAR: { label: 'Bearish', icon: '🟥', color: '#ff6e40', score: -1 },
  STRONG_BEAR: { label: 'Strong Bearish', icon: '🔴', color: '#ff1744', score: -2 },
};

function getSignalFromScore(score) {
  if (score >= 1.5) return SIGNAL.STRONG_BULL;
  if (score >= 0.5) return SIGNAL.BULL;
  if (score > -0.5) return SIGNAL.NEUTRAL;
  if (score > -1.5) return SIGNAL.BEAR;
  return SIGNAL.STRONG_BEAR;
}

// ===== Individual Analyzers =====

/**
 * Analyze stock market momentum.
 */
function analyzeStocks(stocks) {
  if (!stocks || !Array.isArray(stocks)) return null;

  const valid = stocks.filter((s) => s.price != null && s.dailyChange != null);
  if (valid.length === 0) return null;

  const avgDailyChange = valid.reduce((sum, s) => sum + s.dailyChange, 0) / valid.length;
  const avgWeeklyChange = valid
    .filter((s) => s.weeklyChange != null)
    .reduce((sum, s, _, arr) => sum + s.weeklyChange / arr.length, 0);
  const bullishCount = valid.filter((s) => s.dailyChange > 0).length;
  const breadth = bullishCount / valid.length; // market breadth

  let score = 0;
  // Momentum
  if (avgDailyChange > 1.5) score += 1.5;
  else if (avgDailyChange > 0.5) score += 0.8;
  else if (avgDailyChange > 0) score += 0.3;
  else if (avgDailyChange > -0.5) score -= 0.3;
  else if (avgDailyChange > -1.5) score -= 0.8;
  else score -= 1.5;

  // Breadth
  if (breadth > 0.7) score += 0.5;
  else if (breadth < 0.3) score -= 0.5;

  const insights = [];
  insights.push(
    `Average daily change: ${avgDailyChange > 0 ? '+' : ''}${avgDailyChange.toFixed(2)}%`
  );
  insights.push(`Market breadth: ${bullishCount}/${valid.length} indices positive`);

  if (breadth >= 0.8)
    insights.push('💪 Broad-based rally — strong risk-on sentiment');
  else if (breadth <= 0.2)
    insights.push('🔻 Widespread selloff — risk-off environment');

  if (avgWeeklyChange > 3)
    insights.push('📈 Strong weekly momentum — trend likely to continue short-term');
  else if (avgWeeklyChange < -3)
    insights.push(
      '📉 Sharp weekly decline — potential oversold bounce or continuation'
    );

  return {
    category: 'Equities',
    icon: '📈',
    signal: getSignalFromScore(score),
    score,
    insights,
    data: { avgDailyChange, avgWeeklyChange, breadth },
  };
}

/**
 * Analyze Fear & Greed Index for contrarian signals.
 */
function analyzeFearGreed(fng) {
  if (!fng || !fng.value) return null;

  const value = parseInt(fng.value);
  let score = 0;
  const insights = [];

  // Contrarian analysis — extreme fear = buy signal, extreme greed = sell signal
  if (value <= 20) {
    score = 1.5; // Extreme fear → bullish contrarian
    insights.push('😱 Extreme Fear — historically a strong buy signal');
    insights.push('Markets tend to rebound from extreme fear levels');
  } else if (value <= 35) {
    score = 0.8;
    insights.push('😟 Fear zone — potential accumulation opportunity');
    insights.push('Institutional money often enters during fear');
  } else if (value <= 55) {
    score = 0;
    insights.push('😐 Neutral sentiment — no strong directional bias');
    insights.push('Watch for breakout above 60 or breakdown below 40');
  } else if (value <= 75) {
    score = -0.5;
    insights.push('😀 Greed building — exercise caution with new positions');
    insights.push('Market may be getting ahead of fundamentals');
  } else {
    score = -1.5; // Extreme greed → bearish contrarian
    insights.push('🤑 Extreme Greed — historically a sell/reduce signal');
    insights.push('High probability of pullback from these levels');
  }

  return {
    category: 'Sentiment',
    icon: '🧠',
    signal: getSignalFromScore(score),
    score,
    insights,
    data: { value },
  };
}

/**
 * Analyze crypto market trends.
 */
function analyzeCrypto(crypto, globalData) {
  if (!crypto || !Array.isArray(crypto)) return null;

  const btc = crypto.find(
    (c) => c.symbol === 'btc' || c.id === 'bitcoin'
  );
  const eth = crypto.find(
    (c) => c.symbol === 'eth' || c.id === 'ethereum'
  );

  let score = 0;
  const insights = [];

  if (btc) {
    const btcChange24h = btc.price_change_percentage_24h_in_currency ?? btc.price_change_percentage_24h ?? 0;
    const btcChange7d = btc.price_change_percentage_7d_in_currency ?? 0;

    if (btcChange24h > 5) score += 1.5;
    else if (btcChange24h > 2) score += 0.8;
    else if (btcChange24h > 0) score += 0.3;
    else if (btcChange24h > -2) score -= 0.3;
    else if (btcChange24h > -5) score -= 0.8;
    else score -= 1.5;

    insights.push(
      `BTC 24h: ${btcChange24h > 0 ? '+' : ''}${btcChange24h.toFixed(1)}%`
    );
    if (btcChange7d)
      insights.push(
        `BTC 7d: ${btcChange7d > 0 ? '+' : ''}${btcChange7d.toFixed(1)}%`
      );
  }

  // BTC dominance analysis
  if (globalData?.bitcoin_dominance_percentage) {
    const btcDom = globalData.bitcoin_dominance_percentage;
    if (btcDom > 60) {
      insights.push(
        `BTC dominance ${btcDom.toFixed(1)}% — capital consolidating in BTC (alt season unlikely)`
      );
    } else if (btcDom < 45) {
      insights.push(
        `BTC dominance ${btcDom.toFixed(1)}% — altcoin season potential`
      );
      score += 0.3;
    }
  }

  // ETH/BTC ratio
  if (btc && eth && btc.current_price && eth.current_price) {
    const ratio = eth.current_price / btc.current_price;
    if (ratio < 0.03) {
      insights.push('ETH/BTC ratio low — ETH may be undervalued relative to BTC');
    }
  }

  // Market cap flow
  if (globalData?.total_market_cap?.usd) {
    const totalMcap = globalData.total_market_cap.usd;
    if (totalMcap > 3e12)
      insights.push('Total crypto market cap above $3T — strong institutional interest');
    else if (totalMcap < 1.5e12)
      insights.push('Total crypto market cap below $1.5T — potential accumulation zone');
  }

  return {
    category: 'Crypto',
    icon: '₿',
    signal: getSignalFromScore(score),
    score,
    insights,
  };
}

/**
 * Analyze gold as safe-haven indicator.
 */
function analyzeGold(gold) {
  if (!gold || !gold.price) return null;

  let score = 0;
  const insights = [];

  const dc = gold.dailyChange || 0;

  if (dc > 2) {
    score = 1;
    insights.push('🔥 Gold surging — flight to safety, risk-off signal');
    insights.push('Consider: global uncertainty driving safe-haven demand');
  } else if (dc > 0.5) {
    score = 0.5;
    insights.push('Gold rising — moderate safe-haven buying');
  } else if (dc > -0.5) {
    score = 0;
    insights.push('Gold stable — no strong safe-haven flow');
  } else if (dc > -2) {
    score = -0.5;
    insights.push('Gold weakening — risk-on sentiment, equities favored');
  } else {
    score = -1;
    insights.push('Gold declining sharply — strong risk-on or dollar strength');
  }

  if (gold.price > 3000)
    insights.push(
      `Gold at $${gold.price.toLocaleString()} — elevated prices may limit further upside`
    );

  return {
    category: 'Gold / Safe Haven',
    icon: '🥇',
    signal: getSignalFromScore(score),
    score,
    insights,
  };
}

/**
 * Analyze oil market for macro implications.
 */
function analyzeOil(oil) {
  if (!oil || !Array.isArray(oil) || oil.length === 0) return null;

  const wti = oil.find((o) => o.name === 'WTI Crude');
  const brent = oil.find((o) => o.name === 'Brent Crude');

  let score = 0;
  const insights = [];

  const primary = wti || brent || oil[0];
  const dc = primary.dailyChange || 0;

  if (dc > 3) {
    score += -0.5; // Rising oil = inflationary = bearish for growth
    insights.push('🛢️ Oil spiking — inflationary pressure, negative for growth stocks');
  } else if (dc > 1) {
    insights.push('Oil rising moderately — watch for inflation impact');
  } else if (dc < -3) {
    score += 0.5; // Falling oil = deflationary = mixed
    insights.push('Oil declining sharply — could signal demand weakness or supply glut');
  } else if (dc < -1) {
    insights.push('Oil easing — positive for consumer spending');
  } else {
    insights.push('Oil stable — neutral macro signal');
  }

  // WTI-Brent spread analysis
  if (wti && brent && wti.price && brent.price) {
    const spread = brent.price - wti.price;
    insights.push(
      `Brent-WTI spread: $${spread.toFixed(2)} — ${
        spread > 10 ? 'wide (global supply concerns)' : 'normal range'
      }`
    );
  }

  return {
    category: 'Energy / Oil',
    icon: '🛢️',
    signal: getSignalFromScore(score),
    score,
    insights,
  };
}

/**
 * Analyze forex for dollar strength.
 */
function analyzeForex(forex) {
  if (!forex || !Array.isArray(forex)) return null;

  const insights = [];
  let dollarStrength = 0;

  // USD/JPY: higher = stronger dollar
  const usdjpy = forex.find((p) => p.pair === 'USD/JPY');
  if (usdjpy && usdjpy.weekRate) {
    const change = ((usdjpy.rate - usdjpy.weekRate) / usdjpy.weekRate) * 100;
    if (change > 1) dollarStrength += 1;
    else if (change < -1) dollarStrength -= 1;
  }

  // EUR/USD: higher = weaker dollar
  const eurusd = forex.find((p) => p.pair === 'EUR/USD');
  if (eurusd && eurusd.weekRate) {
    const change = ((eurusd.rate - eurusd.weekRate) / eurusd.weekRate) * 100;
    if (change > 1) dollarStrength -= 1; // EUR strengthening = USD weakening
    else if (change < -1) dollarStrength += 1;
  }

  let score = 0;
  if (dollarStrength >= 2) {
    score = -0.5;
    insights.push('💵 Strong USD — headwind for commodities and EM assets');
  } else if (dollarStrength <= -2) {
    score = 0.5;
    insights.push('💵 Weak USD — tailwind for commodities and emerging markets');
  } else {
    insights.push('💵 USD broadly stable — neutral FX backdrop');
  }

  if (usdjpy) {
    insights.push(`USD/JPY at ${usdjpy.rate.toFixed(2)} — ${
      usdjpy.rate > 150 ? 'yen weakness may trigger BOJ intervention risk' :
      usdjpy.rate < 130 ? 'yen strength suggesting risk-off' : 'normal range'
    }`);
  }

  return {
    category: 'FX / Dollar',
    icon: '💱',
    signal: getSignalFromScore(score),
    score,
    insights,
  };
}

// ===== Cross-Market Analysis =====

/**
 * Generate cross-market correlation insights.
 */
function crossMarketAnalysis(analyses) {
  const insights = [];

  const stockScore = analyses.find((a) => a?.category === 'Equities')?.score ?? 0;
  const goldScore = analyses.find((a) => a?.category === 'Gold / Safe Haven')?.score ?? 0;
  const cryptoScore = analyses.find((a) => a?.category === 'Crypto')?.score ?? 0;
  const sentimentScore = analyses.find((a) => a?.category === 'Sentiment')?.score ?? 0;

  // Stock-Gold divergence
  if (stockScore > 0.5 && goldScore > 0.5) {
    insights.push({
      text: '⚡ Stocks AND Gold both rising — unusual. Could signal inflation hedge + growth. Watch for reversal.',
      type: 'warning',
    });
  }
  if (stockScore < -0.5 && goldScore > 0.5) {
    insights.push({
      text: '🛡️ Classic risk-off: stocks falling, gold rising — capital seeking safety.',
      type: 'info',
    });
  }

  // Crypto-Stock correlation
  if (Math.abs(stockScore - cryptoScore) > 2) {
    insights.push({
      text: '🔄 Stock-crypto divergence detected — unusual decorrelation may signal regime shift.',
      type: 'warning',
    });
  }

  // Sentiment contrarian
  if (sentimentScore > 1 && stockScore > 0.5) {
    insights.push({
      text: '📊 Extreme fear + rising markets = potential bottom. Contrarian buy signal.',
      type: 'bullish',
    });
  }
  if (sentimentScore < -1 && stockScore > 0.5) {
    insights.push({
      text: '⚠️ Extreme greed + rising markets = potential top. Consider reducing exposure.',
      type: 'bearish',
    });
  }

  return insights;
}

// ===== Main Analysis Function =====

/**
 * Run complete market analysis on all collected data.
 * Returns structured analysis results for each asset class
 * plus cross-market insights and overall outlook.
 */
export function analyzeMarketData(allData) {
  if (!allData) return null;

  const analyses = [
    analyzeStocks(allData.stocks),
    analyzeFearGreed(allData.fng),
    analyzeCrypto(allData.crypto, allData.cryptoGlobal),
    analyzeGold(allData.gold),
    analyzeOil(allData.oil),
    analyzeForex(allData.forex),
  ].filter(Boolean);

  if (analyses.length === 0) return null;

  // Overall score — weighted average
  const weights = {
    Equities: 2,
    Sentiment: 1.5,
    Crypto: 1.2,
    'Gold / Safe Haven': 1,
    'Energy / Oil': 0.8,
    'FX / Dollar': 0.8,
  };

  let totalWeight = 0;
  let weightedSum = 0;
  analyses.forEach((a) => {
    const w = weights[a.category] || 1;
    weightedSum += a.score * w;
    totalWeight += w;
  });

  const overallScore = totalWeight > 0 ? weightedSum / totalWeight : 0;
  const overallSignal = getSignalFromScore(overallScore);

  // Cross-market insights
  const crossInsights = crossMarketAnalysis(analyses);

  // Generate short-term and long-term outlook
  const shortTermOutlook = generateShortTermOutlook(overallScore, analyses);
  const longTermOutlook = generateLongTermOutlook(analyses);

  return {
    analyses,
    overallScore,
    overallSignal,
    crossInsights,
    shortTermOutlook,
    longTermOutlook,
    generatedAt: new Date(),
  };
}

function generateShortTermOutlook(overallScore, analyses) {
  const sentiment = analyses.find((a) => a.category === 'Sentiment');
  const fngValue = sentiment?.data?.value;

  if (overallScore > 1) {
    return {
      outlook: 'Risk-On Rally',
      description: 'Strong bullish momentum across markets. Short-term trend likely to continue. Watch for overbought conditions.',
      color: '#00e676',
    };
  }
  if (overallScore > 0.3) {
    return {
      outlook: 'Cautiously Bullish',
      description: 'Positive momentum with some headwinds. Favor equities and crypto with tight risk management.',
      color: '#69f0ae',
    };
  }
  if (overallScore > -0.3) {
    return {
      outlook: 'Range-Bound / Mixed',
      description: 'No clear directional bias. Markets may chop sideways. Wait for clearer signals before taking large positions.',
      color: '#ffd740',
    };
  }
  if (overallScore > -1) {
    return {
      outlook: 'Cautiously Bearish',
      description: 'Negative momentum building. Consider defensive positioning — reduce risk exposure, increase cash allocation.',
      color: '#ff6e40',
    };
  }
  return {
    outlook: 'Risk-Off / Defensive',
    description: 'Strong bearish signals. Capital preservation priority. Consider safe havens (gold, bonds, stablecoins). Wait for capitulation.',
    color: '#ff1744',
  };
}

function generateLongTermOutlook(analyses) {
  const gold = analyses.find((a) => a.category === 'Gold / Safe Haven');
  const sentiment = analyses.find((a) => a.category === 'Sentiment');
  const stocks = analyses.find((a) => a.category === 'Equities');

  const points = [];

  // Structural observations
  if (gold?.score > 0) {
    points.push('Gold strength suggests persistent inflation or geopolitical uncertainty — may favor real assets long-term');
  }
  if (sentiment?.data?.value < 30) {
    points.push('Historical data shows extreme fear periods often precede 6-12 month rallies in equities');
  }
  if (sentiment?.data?.value > 75) {
    points.push('Extended greed often precedes corrections. 3-6 month outlook may include significant pullback');
  }
  if (stocks?.data?.avgWeeklyChange > 5) {
    points.push('Rapid appreciation rarely sustainable. Mean reversion likely over next quarter');
  }
  if (stocks?.data?.breadth > 0.8) {
    points.push('Broad participation in rally suggests healthy trend — less likely to fade quickly');
  }

  if (points.length === 0) {
    points.push('Insufficient data for strong long-term conviction. Monitor weekly trends for developing patterns.');
  }

  return points;
}
