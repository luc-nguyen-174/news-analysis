import { useState } from 'react';
import Skeleton from './Skeleton';

/**
 * Format relative time (e.g. "2h ago", "3d ago").
 */
function timeAgo(date) {
  if (!date) return '';
  const now = new Date();
  const diff = now - date;
  const mins = Math.floor(diff / 60000);
  const hrs = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  if (hrs < 24) return `${hrs}h ago`;
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/**
 * Single news article row.
 */
function NewsArticle({ article }) {
  return (
    <a
      href={article.link}
      target="_blank"
      rel="noreferrer"
      className="news-article"
    >
      <div className="news-article-content">
        <span className="news-title">{article.title}</span>
        <div className="news-meta">
          <span className={`news-source ${article.type === 'reddit' ? 'reddit' : ''}`}>
            {article.type === 'reddit' ? '🔥 ' : '📰 '}
            {article.source}
          </span>
          {article.type === 'reddit' && article.score != null && (
            <span className="news-score">▲ {article.score.toLocaleString()}</span>
          )}
          {article.type === 'reddit' && article.comments != null && (
            <span className="news-comments">💬 {article.comments}</span>
          )}
          <span className="news-time">{timeAgo(article.pubDate)}</span>
        </div>
      </div>
      <span className="news-arrow">→</span>
    </a>
  );
}

/**
 * Category tab for news filtering.
 */
function CategoryTab({ cat, isActive, onClick }) {
  return (
    <button
      className={`news-tab${isActive ? ' active' : ''}`}
      onClick={onClick}
      style={{
        '--tab-color': cat.color,
      }}
    >
      <span className="news-tab-icon">{cat.icon}</span>
      <span className="news-tab-label">{cat.label.replace(/^[^\s]+\s/, '')}</span>
    </button>
  );
}

export default function NewsSection({ newsData, loading }) {
  const [activeCategory, setActiveCategory] = useState('macro');

  if (loading) {
    return (
      <div className="news-section">
        <div className="news-header">
          <div className="news-header-brand">
            <span className="news-header-icon">📡</span>
            <h2 className="news-header-title">Market Intelligence Feed</h2>
          </div>
          <span className="news-header-badge">AI CURATED</span>
        </div>
        <Skeleton rows={8} />
      </div>
    );
  }

  if (!newsData || Object.keys(newsData).length === 0) {
    return (
      <div className="news-section">
        <div className="news-header">
          <div className="news-header-brand">
            <span className="news-header-icon">📡</span>
            <h2 className="news-header-title">Market Intelligence Feed</h2>
          </div>
          <span className="news-header-badge">NEWS</span>
        </div>
        <div className="empty-state">
          <div className="empty-icon">📰</div>
          <p>Click "Collect Data" to fetch market news</p>
        </div>
      </div>
    );
  }

  const categories = Object.values(newsData);
  const activeCat = newsData[activeCategory] || categories[0];

  return (
    <div className="news-section fade-in">
      <div className="news-header">
        <div className="news-header-brand">
          <span className="news-header-icon">📡</span>
          <h2 className="news-header-title">Market Intelligence Feed</h2>
        </div>
        <span className="news-header-subtitle">
          News & signals that may impact future prices
        </span>
        <span className="news-header-badge">LIVE</span>
      </div>

      {/* Category Tabs */}
      <div className="news-tabs">
        {categories.map((cat) => (
          <CategoryTab
            key={cat.id}
            cat={cat}
            isActive={activeCategory === cat.id}
            onClick={() => setActiveCategory(cat.id)}
          />
        ))}
      </div>

      {/* Articles List */}
      <div className="news-articles">
        {activeCat && activeCat.articles.length > 0 ? (
          activeCat.articles.map((article, i) => (
            <NewsArticle key={`${article.link}-${i}`} article={article} />
          ))
        ) : (
          <div className="news-empty">
            <p>No recent news found for this category</p>
          </div>
        )}
      </div>

      <div className="news-footer-note">
        Sources: Google News, Reddit &bull; Auto-aggregated, not financial advice
      </div>
    </div>
  );
}
