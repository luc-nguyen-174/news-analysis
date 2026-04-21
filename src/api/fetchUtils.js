/**
 * CORS-safe fetch layer.
 * In development (Vite), uses local proxy paths to bypass CORS.
 * In production, uses external CORS proxy fallbacks.
 */

const isDev = import.meta.env.DEV;

/**
 * Fetch JSON with timeout support.
 * Throws on non-ok status or network error.
 */
async function fetchWithTimeout(url, timeoutMs = 15000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (e) {
    clearTimeout(timer);
    throw e;
  }
}

/**
 * Fetch text with timeout support (for RSS/XML).
 */
export async function fetchTextWithTimeout(url, timeoutMs = 15000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.text();
  } catch (e) {
    clearTimeout(timer);
    throw e;
  }
}

/**
 * Fetch JSON via multiple CORS proxy fallbacks (for production/deployed builds).
 * Silently handles failures to avoid console noise.
 */
export async function proxyFetchJSON(url, timeoutMs = 20000) {
  const errors = [];

  // Attempt 1: allorigins /raw mode (most reliable)
  try {
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
    const data = await fetchWithTimeout(proxyUrl, timeoutMs);
    return data;
  } catch (e) {
    errors.push(`allorigins: ${e.message}`);
  }

  // Attempt 2: corsproxy.io
  try {
    const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(url)}`;
    const data = await fetchWithTimeout(proxyUrl, timeoutMs);
    return data;
  } catch (e) {
    errors.push(`corsproxy: ${e.message}`);
  }

  throw new Error(
    `All proxy attempts failed for ${url.substring(0, 60)}...`
  );
}

/**
 * Smart fetch: In dev mode, use local proxy URL directly.
 * In production, try direct then CORS proxy fallback.
 */
export async function fetchSmart(url) {
  if (isDev || url.startsWith('/')) {
    // Dev proxy URL (local path) — just fetch directly, no fallback needed
    return await fetchWithTimeout(url);
  }
  // Production: try direct then proxy
  try {
    return await fetchWithTimeout(url);
  } catch {
    return await proxyFetchJSON(url);
  }
}

/**
 * Fetch Yahoo Finance chart data.
 * In dev: uses Vite proxy paths (with proper headers set in vite.config.js).
 * In prod: uses CORS proxies.
 */
export async function fetchYahooChart(symbol) {
  const encodedSymbol = encodeURIComponent(symbol);
  const params = `interval=1d&range=5d`;

  if (isDev) {
    // Use Vite proxy — headers are set in vite.config.js
    const urls = [
      `/api/yahoo1/v8/finance/chart/${encodedSymbol}?${params}`,
      `/api/yahoo2/v8/finance/chart/${encodedSymbol}?${params}`,
    ];
    for (const url of urls) {
      try {
        const data = await fetchWithTimeout(url, 15000);
        const result = data?.chart?.result?.[0];
        if (result) return result;
      } catch {
        /* try next endpoint */
      }
    }
    // If both dev proxies fail, don't try external CORS proxies in dev
    // (they'll just produce more console errors)
    throw new Error(`Yahoo Finance unavailable for ${symbol}`);
  }

  // Production: CORS proxy approach
  const urls = [
    `https://query1.finance.yahoo.com/v8/finance/chart/${encodedSymbol}?${params}`,
    `https://query2.finance.yahoo.com/v8/finance/chart/${encodedSymbol}?${params}`,
  ];

  for (const url of urls) {
    try {
      const data = await proxyFetchJSON(url);
      const result = data?.chart?.result?.[0];
      if (result) return result;
    } catch {
      /* try next */
    }
  }
  throw new Error('Yahoo Finance unavailable');
}

/**
 * Parse Yahoo Finance chart result into normalized data.
 */
export function parseYahooResult(result) {
  const meta = result.meta;
  const closes =
    result.indicators?.quote?.[0]?.close?.filter((c) => c != null) || [];
  const price = meta.regularMarketPrice;
  const prevClose =
    meta.chartPreviousClose ||
    (closes.length >= 2 ? closes[closes.length - 2] : price);
  const weekAgoClose = closes.length >= 5 ? closes[0] : prevClose;
  const dailyChange = prevClose
    ? ((price - prevClose) / prevClose) * 100
    : 0;
  const weeklyChange = weekAgoClose
    ? ((price - weekAgoClose) / weekAgoClose) * 100
    : 0;
  return {
    price,
    dailyChange,
    weeklyChange,
    prevClose,
    weekAgoClose,
    currency: meta.currency,
  };
}

// ===== Dev-mode proxy URL helpers =====

export function frankfurterUrl(path) {
  return isDev ? `/api/frankfurter${path}` : `https://api.frankfurter.app${path}`;
}

export function exchangeRateUrl(path) {
  return isDev ? `/api/exchangerate${path}` : `https://open.er-api.com${path}`;
}

export function coingeckoUrl(path) {
  return isDev ? `/api/coingecko${path}` : `https://api.coingecko.com${path}`;
}

export function alternativeUrl(path) {
  return isDev ? `/api/alternative${path}` : `https://api.alternative.me${path}`;
}

export function metalsUrl(path) {
  return isDev ? `/api/metals${path}` : `https://api.metals.dev${path}`;
}
