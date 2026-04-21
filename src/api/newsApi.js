/**
 * News aggregation API — fetches financial news from Google News RSS and Reddit.
 * Categorized by market sector for relevant insights.
 */

const isDev = import.meta.env.DEV;

// ===== News Categories =====
const NEWS_CATEGORIES = [
  {
    id: 'macro',
    label: '🌍 Macro & Economy',
    icon: '🌍',
    queries: ['global economy financial markets', 'federal reserve interest rate'],
    subreddit: 'economics',
    color: '#448aff',
  },
  {
    id: 'stocks',
    label: '📈 Stocks & Indices',
    icon: '📈',
    queries: ['stock market S&P 500 NASDAQ', 'stock market rally crash'],
    subreddit: 'stocks',
    color: '#448aff',
  },
  {
    id: 'crypto',
    label: '₿ Crypto',
    icon: '₿',
    queries: ['cryptocurrency bitcoin ethereum', 'crypto regulation SEC'],
    subreddit: 'CryptoCurrency',
    color: '#18ffff',
  },
  {
    id: 'forex',
    label: '💱 Forex & Currencies',
    icon: '💱',
    queries: ['forex USD dollar currency', 'central bank monetary policy'],
    subreddit: null,
    color: '#b388ff',
  },
  {
    id: 'commodities',
    label: '🛢️ Gold & Oil',
    icon: '🛢️',
    queries: ['gold price precious metals', 'oil price OPEC crude'],
    subreddit: null,
    color: '#ffd740',
  },
];

/**
 * Parse Google News RSS XML into structured articles.
 */
function parseRSSFeed(xmlText) {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlText, 'text/xml');
    const items = doc.querySelectorAll('item');
    const articles = [];

    items.forEach((item) => {
      const title = item.querySelector('title')?.textContent || '';
      const link = item.querySelector('link')?.textContent || '';
      const pubDate = item.querySelector('pubDate')?.textContent || '';
      const source = item.querySelector('source')?.textContent || 'Google News';

      // Clean up title — Google News sometimes appends " - Source" at the end
      const cleanTitle = title.replace(/ - [^-]+$/, '').trim();

      articles.push({
        title: cleanTitle || title,
        link,
        pubDate: pubDate ? new Date(pubDate) : new Date(),
        source,
        type: 'news',
      });
    });

    return articles;
  } catch {
    return [];
  }
}

/**
 * Fetch Google News RSS for a search query.
 */
async function fetchGoogleNewsRSS(query, maxResults = 5) {
  const encodedQuery = encodeURIComponent(query);
  const baseUrl = isDev ? '/api/gnews' : 'https://news.google.com';
  const url = `${baseUrl}/rss/search?q=${encodedQuery}&hl=en-US&gl=US&ceid=US:en`;

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 10000);
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timer);

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const xmlText = await res.text();
    const articles = parseRSSFeed(xmlText);
    return articles.slice(0, maxResults);
  } catch {
    return [];
  }
}

/**
 * Fetch top posts from a Reddit subreddit.
 */
async function fetchRedditPosts(subreddit, maxResults = 3) {
  if (!subreddit) return [];

  const baseUrl = isDev ? '/api/reddit' : 'https://www.reddit.com';
  const url = `${baseUrl}/r/${subreddit}/hot.json?limit=${maxResults + 2}&t=day`;

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 10000);
    const res = await fetch(url, {
      signal: controller.signal,
      headers: isDev ? {} : { 'User-Agent': 'MarketPulse/1.0' },
    });
    clearTimeout(timer);

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    return (data?.data?.children || [])
      .filter((child) => !child.data.stickied) // Skip pinned posts
      .slice(0, maxResults)
      .map((child) => ({
        title: child.data.title,
        link: `https://www.reddit.com${child.data.permalink}`,
        pubDate: new Date(child.data.created_utc * 1000),
        source: `r/${subreddit}`,
        score: child.data.score,
        comments: child.data.num_comments,
        type: 'reddit',
      }));
  } catch {
    return [];
  }
}

/**
 * Fetch all news for all categories.
 * Returns an object keyed by category ID.
 */
export async function fetchAllNews(showToast) {
  try {
    const categoryPromises = NEWS_CATEGORIES.map(async (cat) => {
      // Fetch from all queries in parallel
      const [newsResults, redditResults] = await Promise.allSettled([
        // Google News — fetch first query
        fetchGoogleNewsRSS(cat.queries[0], 4),
        // Reddit
        fetchRedditPosts(cat.subreddit, 3),
      ]);

      const news =
        newsResults.status === 'fulfilled' ? newsResults.value : [];
      const reddit =
        redditResults.status === 'fulfilled' ? redditResults.value : [];

      // Merge and sort by date
      const allArticles = [...news, ...reddit].sort(
        (a, b) => b.pubDate - a.pubDate
      );

      return {
        id: cat.id,
        label: cat.label,
        icon: cat.icon,
        color: cat.color,
        articles: allArticles.slice(0, 6),
      };
    });

    const results = await Promise.allSettled(categoryPromises);
    const newsData = {};

    results.forEach((r) => {
      if (r.status === 'fulfilled' && r.value) {
        newsData[r.value.id] = r.value;
      }
    });

    return newsData;
  } catch (err) {
    showToast(`⚠️ News: ${err.message}`);
    return {};
  }
}

export { NEWS_CATEGORIES };
