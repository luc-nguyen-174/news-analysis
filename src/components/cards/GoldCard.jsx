import Card from './Card';
import Skeleton from '../Skeleton';
import { fmt, cc, arrow } from '../../utils/format';
import { useI18n } from '../../i18n';

export default function GoldCard({ data, loading, currentView }) {
  const { t } = useI18n();
  const isWeekly = currentView === 'weekly';

  const renderContent = () => {
    if (loading) return <Skeleton rows={4} />;

    if (!data) {
      return (
        <div className="empty-state">
          <div className="empty-icon">✨</div>
          <p>{data === null ? t('failedGold') : t('emptyGold')}</p>
        </div>
      );
    }

    return (
      <div className="fade-in">
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <div className="gold-price-big">${fmt(data.price, 2)}</div>
          <div className="gold-price-sub">{t('xauPerOz')}</div>
        </div>
        <div className="gold-grid">
          <div className="gold-stat">
            <div className="label">{t('change24h')}</div>
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
              <div className="label">{t('change7d')}</div>
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
              <div className="label">{t('prevClose')}</div>
              <div className="value" style={{ color: 'var(--text-primary)' }}>
                {data.prevClose ? '$' + fmt(data.prevClose, 2) : 'N/A'}
              </div>
            </div>
          )}
          <div className="gold-stat" style={{ gridColumn: 'span 2' }}>
            <div className="label">{t('goldVnd')}</div>
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
            {t('source')}: {data.source}
          </div>
        )}
      </div>
    );
  };

  return (
    <Card variant="gold" icon="🥇" title={t('goldMarket')} badge={t('badgeXau')}>
      {renderContent()}
    </Card>
  );
}
