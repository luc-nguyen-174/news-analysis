import Card from './Card';
import Skeleton from '../Skeleton';
import { useI18n } from '../../i18n';

export default function FearGreedCard({ data, loading }) {
  const { t } = useI18n();

  const renderContent = () => {
    if (loading) return <Skeleton rows={4} />;

    if (!data) {
      return (
        <div className="empty-state">
          <div className="empty-icon">🎭</div>
          <p>{data === null ? t('failedFearGreed') : t('emptyFearGreed')}</p>
        </div>
      );
    }

    const value = parseInt(data.value);
    let labelClass = 'neutral-f';
    let gaugeColor = '#ffd740';
    let localizedLabel = t('fngNeutral');

    if (value <= 25) {
      labelClass = 'extreme-fear';
      gaugeColor = '#ff1744';
      localizedLabel = t('fngExtremeFear');
    } else if (value <= 45) {
      labelClass = 'fear';
      gaugeColor = '#ff6e40';
      localizedLabel = t('fngFear');
    } else if (value <= 55) {
      labelClass = 'neutral-f';
      gaugeColor = '#ffd740';
      localizedLabel = t('fngNeutral');
    } else if (value <= 75) {
      labelClass = 'greed';
      gaugeColor = '#69f0ae';
      localizedLabel = t('fngGreed');
    } else {
      labelClass = 'extreme-greed';
      gaugeColor = '#00e676';
      localizedLabel = t('fngExtremeGreed');
    }

    const a = (value / 100) * 180;
    const needleX = 100 + 70 * Math.cos(Math.PI - (a * Math.PI) / 180);
    const needleY = 100 - 70 * Math.sin(Math.PI - (a * Math.PI) / 180);

    return (
      <div className="fng-container fade-in">
        <div className="fng-gauge">
          <svg viewBox="0 0 200 110">
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="#2a2a3a"
              strokeWidth="12"
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="fg" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ff1744" />
                <stop offset="25%" stopColor="#ff6e40" />
                <stop offset="50%" stopColor="#ffd740" />
                <stop offset="75%" stopColor="#69f0ae" />
                <stop offset="100%" stopColor="#00e676" />
              </linearGradient>
            </defs>
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="url(#fg)"
              strokeWidth="12"
              strokeLinecap="round"
              opacity="0.3"
            />
            <line
              x1="100"
              y1="100"
              x2={needleX}
              y2={needleY}
              stroke={gaugeColor}
              strokeWidth="3"
              strokeLinecap="round"
            />
            <circle cx="100" cy="100" r="5" fill={gaugeColor} />
          </svg>
        </div>
        <div className="fng-value" style={{ color: gaugeColor }}>
          {value}
        </div>
        <div className={`fng-label ${labelClass}`}>{localizedLabel}</div>
        <div
          style={{
            marginTop: '8px',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
          }}
        >
          {t('lastUpdated')}:{' '}
          {new Date(data.timestamp * 1000).toLocaleDateString()}
        </div>
      </div>
    );
  };

  return (
    <Card variant="fear" icon="😱" title={t('fearGreedIndex')} badge={t('badgeSentiment')}>
      {renderContent()}
    </Card>
  );
}
