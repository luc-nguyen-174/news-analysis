import {
  proxyFetchJSON,
  fetchSmart,
  fetchYahooChart,
  parseYahooResult,
  frankfurterUrl,
  exchangeRateUrl,
  coingeckoUrl,
  alternativeUrl,
  metalsUrl,
} from './fetchUtils';

/**
 * Fetch stock index data for major global indices.
 */
export async function fetchStocks(showToast) {
  const symbols = [
    { sym: '^GSPC', name: 'S&P 500' },
    { sym: '^DJI', name: 'Dow Jones' },
    { sym: '^IXIC', name: 'NASDAQ' },
    { sym: '^N225', name: 'Nikkei 225' },
    { sym: '^HSI', name: 'Hang Seng' },
    { sym: '^FTSE', name: 'FTSE 100' },
    { sym: '^GDAXI', name: 'DAX' },
    { sym: '^VNINDEX', name: 'VN-Index' },
  ];

  const results = await Promise.allSettled(
    symbols.map(async (s) => {
      try {
        const result = await fetchYahooChart(s.sym);
        const parsed = parseYahooResult(result);
        return { symbol: s.sym, name: s.name, ...parsed };
      } catch (err) {
        return {
          symbol: s.sym,
          name: s.name,
          price: null,
          dailyChange: null,
          weeklyChange: null,
          error: err.message,
        };
      }
    })
  );

  const data = results
    .map((r) => (r.status === 'fulfilled' ? r.value : null))
    .filter(Boolean);
  const failed = data.filter((d) => d.price === null);
  if (failed.length === data.length) {
    showToast('⚠️ Stock data unavailable — Yahoo Finance may be blocking requests');
  } else if (failed.length > 0) {
    showToast(
      `⚠️ Some indices unavailable: ${failed.map((f) => f.name).join(', ')}`,
      'info'
    );
  }
  return data;
}

/**
 * Fetch forex rates from Frankfurter + open.er-api.
 */
export async function fetchForex(showToast) {
  try {
    const url = frankfurterUrl('/latest?from=USD&to=JPY,EUR,GBP,CNY');
    const data = await fetchSmart(url);

    let weekData = null;
    try {
      const d = new Date();
      d.setDate(d.getDate() - 7);
      const weekUrl = frankfurterUrl(
        `/${d.toISOString().split('T')[0]}?from=USD&to=JPY,EUR,GBP,CNY`
      );
      weekData = await fetchSmart(weekUrl);
    } catch {
      /* ignore */
    }

    let usdVnd = null;
    try {
      const vndUrl = exchangeRateUrl('/v6/latest/USD');
      const vndData = await fetchSmart(vndUrl);
      usdVnd = vndData?.rates?.VND || null;
    } catch {
      /* ignore */
    }

    const pairs = [
      { pair: 'USD/JPY', rate: data.rates.JPY, weekRate: weekData?.rates?.JPY },
      {
        pair: 'EUR/USD',
        rate: 1 / data.rates.EUR,
        weekRate: weekData ? 1 / weekData.rates.EUR : null,
      },
      {
        pair: 'GBP/USD',
        rate: 1 / data.rates.GBP,
        weekRate: weekData ? 1 / weekData.rates.GBP : null,
      },
      { pair: 'USD/CNY', rate: data.rates.CNY, weekRate: weekData?.rates?.CNY },
      { pair: 'USD/VND', rate: usdVnd, weekRate: null },
    ];

    return pairs;
  } catch (err) {
    showToast(`⚠️ Forex: ${err.message}`);
    return null;
  }
}

/**
 * Fetch top 10 crypto coins by market cap.
 */
export async function fetchCrypto(showToast) {
  try {
    const url = coingeckoUrl(
      '/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&sparkline=false&price_change_percentage=24h,7d'
    );
    return await fetchSmart(url);
  } catch (err) {
    showToast(`⚠️ Crypto: ${err.message}`);
    return null;
  }
}

/**
 * Fetch global crypto market data.
 */
export async function fetchCryptoGlobal(showToast) {
  try {
    const url = coingeckoUrl('/api/v3/global');
    const data = await fetchSmart(url);
    return data.data;
  } catch (err) {
    showToast(`⚠️ Crypto Global: ${err.message}`);
    return null;
  }
}

/**
 * Fetch Fear & Greed Index.
 */
export async function fetchFearGreed(showToast) {
  try {
    const url = alternativeUrl('/fng/?limit=2');
    const data = await fetchSmart(url);
    return data.data?.[0] || null;
  } catch (err) {
    showToast(`⚠️ Fear & Greed: ${err.message}`);
    return null;
  }
}

/**
 * Helper: fetch VND exchange rate.
 */
async function getVndRate() {
  try {
    const vndUrl = exchangeRateUrl('/v6/latest/USD');
    const vndData = await fetchSmart(vndUrl);
    return vndData?.rates?.VND || null;
  } catch {
    return null;
  }
}

/**
 * Helper: calculate SJC-style VND gold price per tael.
 * Gold per troy ounce → VND per tael (37.5g / 31.1035g per troy oz).
 */
function calcSjcPrice(pricePerOz, vndRate) {
  if (!pricePerOz || !vndRate) return null;
  return pricePerOz * (37.5 / 31.1035) * vndRate;
}

/**
 * Fetch gold price data using multiple sources:
 * 1) CoinGecko exchange_rates → derive real XAU/USD spot price
 * 2) Yahoo Finance GC=F futures
 * 3) CoinGecko PAX Gold (last resort, may have premium)
 */
export async function fetchGold(showToast) {
  const vndRate = await getVndRate();

  // Source 1: CoinGecko exchange_rates — derives REAL XAU spot price
  // Logic: BTC price in USD / BTC price in XAU = 1 XAU in USD
  try {
    const url = coingeckoUrl('/api/v3/exchange_rates');
    const data = await fetchSmart(url);
    const rates = data?.rates;
    if (rates && rates.usd && rates.xau) {
      // rates.usd.value = how many USD per 1 BTC
      // rates.xau.value = how many XAU (troy oz) per 1 BTC
      const xauPerUsd = rates.usd.value / rates.xau.value;
      const price = Math.round(xauPerUsd * 100) / 100;

      // Get 24h change from BTC data (approximate gold change)
      let dailyChange = null;
      try {
        const btcUrl = coingeckoUrl(
          '/api/v3/simple/price?ids=bitcoin&vs_currencies=xau&include_24hr_change=true'
        );
        const btcData = await fetchSmart(btcUrl);
        // If BTC/XAU 24h change is X%, gold moved roughly -X% vs USD
        // But this is approximate. For better accuracy, we skip this.
        dailyChange = null;
      } catch { /* ignore */ }

      return {
        price,
        dailyChange,
        weeklyChange: null,
        prevClose: null,
        sjcPrice: calcSjcPrice(price, vndRate),
        source: 'CoinGecko (XAU spot)',
      };
    }
  } catch {
    /* try next */
  }

  // Source 2: Yahoo Finance GC=F (gold futures)
  try {
    const result = await fetchYahooChart('GC=F');
    const parsed = parseYahooResult(result);
    return {
      ...parsed,
      sjcPrice: calcSjcPrice(parsed.price, vndRate),
      source: 'Yahoo Finance',
    };
  } catch {
    /* try next */
  }

  // Source 3: CoinGecko PAX Gold (backed 1:1 by gold, may have slight premium)
  try {
    const url = coingeckoUrl(
      '/api/v3/simple/price?ids=pax-gold&vs_currencies=usd&include_24hr_change=true'
    );
    const data = await fetchSmart(url);
    const paxg = data['pax-gold'];
    if (paxg && paxg.usd) {
      const price = paxg.usd;
      const dailyChange = paxg.usd_24h_change || 0;
      return {
        price,
        dailyChange,
        weeklyChange: null,
        prevClose: price / (1 + dailyChange / 100),
        sjcPrice: calcSjcPrice(price, vndRate),
        source: 'CoinGecko (PAXG ≈ spot)',
      };
    }
  } catch {
    /* last resort failed */
  }

  showToast('⚠️ Gold price unavailable from all sources');
  return null;
}

/**
 * Fetch oil prices (WTI & Brent).
 */
export async function fetchOil(showToast) {
  const symbols = [
    { sym: 'CL=F', name: 'WTI Crude' },
    { sym: 'BZ=F', name: 'Brent Crude' },
  ];

  const results = await Promise.allSettled(
    symbols.map(async (s) => {
      const result = await fetchYahooChart(s.sym);
      const parsed = parseYahooResult(result);
      return { name: s.name, ...parsed };
    })
  );

  const data = results
    .filter((r) => r.status === 'fulfilled')
    .map((r) => r.value);

  if (data.length === 0) {
    showToast('⚠️ Oil data unavailable — Yahoo Finance may be blocking requests');
    return null;
  }
  return data;
}

/**
 * Fetch BTC 7-day sparkline data.
 */
export async function fetchBTCSparkline(showToast) {
  try {
    const url = coingeckoUrl(
      '/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=7'
    );
    const data = await fetchSmart(url);
    return data.prices;
  } catch (err) {
    showToast(`⚠️ BTC Chart: ${err.message}`);
    return null;
  }
}
