/**
 * Format a number with locale formatting.
 * @param {number} n - The number to format
 * @param {number} d - Decimal places (default: 2)
 * @returns {string}
 */
export function fmt(n, d = 2) {
  if (n == null || isNaN(n)) return 'N/A';
  return Number(n).toLocaleString('en-US', {
    minimumFractionDigits: d,
    maximumFractionDigits: d,
  });
}

/**
 * Format large numbers with T/B/M suffixes.
 * @param {number} n
 * @returns {string}
 */
export function fmtLarge(n) {
  if (n == null || isNaN(n)) return 'N/A';
  if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`;
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  return `$${fmt(n)}`;
}

/**
 * Get CSS class for change direction.
 * @param {number} v
 * @returns {'up'|'down'|'neutral'}
 */
export function cc(v) {
  if (v == null || isNaN(v)) return 'neutral';
  return v > 0 ? 'up' : v < 0 ? 'down' : 'neutral';
}

/**
 * Get arrow character for change direction.
 * @param {number} v
 * @returns {string}
 */
export function arrow(v) {
  if (v == null || isNaN(v)) return '';
  return v > 0 ? '▲' : v < 0 ? '▼' : '—';
}
