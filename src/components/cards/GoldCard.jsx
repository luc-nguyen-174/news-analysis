import Card from './Card';
import Skeleton from '../Skeleton';
import { fmt, cc, arrow } from '../../utils/format';

export default function GoldCard({ data, loading, currentView }) {
  const isWeekly = currentView === 'weekly';

  const renderContent = () => {
    if (loading) return <Skeleton rows={4} />;

    if (!data) {
      return (
        <div className="empty-state">
          <div className="empty-icon">✨</div>
          <p>{data === null ? 'Failed to load gold data' : 'Click "Collect Data" to fetch gold prices'}</p>
        </div>
      );
    }

    return (
      <div className="fade-in">
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <div className="gold-price-big">${fmt(data.price, 2)}</div>
          <div className="gold-price-sub">XAU/USD per troy ounce</div>
        </div>
        <div className="gold-grid">
          <div className="gold-stat">
            <div className="label">24h Change</div>
            <div className="value">
              <span className={`change ${cc(data.dailyChange)}`}>
                {arrow(data.dailyChange)}{' '}
                {data.dailyChange != null
                  ? fmt(Math.abs(data.dailyChange)) + '%'
                  : 'N/A'}
              </span>
            </div>
          </div>
          {isWeekly ? (
            <div className="gold-stat">
              <div className="label">7d Change</div>
              <div className="value">
                <span className={`change ${cc(data.weeklyChange)}`}>
                  {arrow(data.weeklyChange)}{' '}
                  {data.weeklyChange != null
                    ? fmt(Math.abs(data.weeklyChange)) + '%'
                    : 'N/A'}
                </span>
              </div>
            </div>
          ) : (
            <div className="gold-stat">
              <div className="label">Prev Close</div>
              <div className="value" style={{ color: 'var(--text-primary)' }}>
                {data.prevClose ? '$' + fmt(data.prevClose, 2) : 'N/A'}
              </div>
            </div>
          )}
          <div className="gold-stat" style={{ gridColumn: 'span 2' }}>
            <div className="label">Gold in VND (est. per tael)</div>
            <div className="value" style={{ color: 'var(--gold)' }}>
              {data.sjcPrice
                ? '₫' +
                  Math.round(data.sjcPrice / 1e6).toLocaleString() +
                  'M'
                : 'N/A'}
            </div>
          </div>
        </div>
        {data.source && (
          <div className="meta-text" style={{ textAlign: 'right', marginTop: '8px' }}>
            Source: {data.source}
          </div>
        )}
      </div>
    );
  };

  return (
    <Card variant="gold" icon="🥇" title="Gold Market" badge="XAU">
      {renderContent()}
    </Card>
  );
}
