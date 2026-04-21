import Card from './Card';
import Skeleton from '../Skeleton';
import { fmt, cc, arrow } from '../../utils/format';
import { useI18n } from '../../i18n';

export default function OilCard({ data, loading, currentView }) {
  const { t } = useI18n();
  const isWeekly = currentView === 'weekly';

  const renderContent = () => {
    if (loading) return <Skeleton rows={4} />;

    if (!data || data.length === 0) {
      return (
        <div className="empty-state">
          <div className="empty-icon">⛽</div>
          <p>{data === null ? t('failedOil') : t('emptyOil')}</p>
        </div>
      );
    }

    return (
      <table className="data-table fade-in">
        <thead>
          <tr>
            <th>{t('colType')}</th>
            <th>{t('colPrice')}</th>
            <th>{t('col24h')}</th>
            {isWeekly && <th>{t('col7d')}</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((o) => (
            <tr key={o.name}>
              <td>
                <span className="symbol-name">{o.name}</span>
              </td>
              <td className="price">${fmt(o.price, 2)}</td>
              <td>
                <span className={`change ${cc(o.dailyChange)}`}>
                  {arrow(o.dailyChange)} {fmt(Math.abs(o.dailyChange))}%
                </span>
              </td>
              {isWeekly && (
                <td>
                  <span className={`change ${cc(o.weeklyChange)}`}>
                    {arrow(o.weeklyChange)} {fmt(Math.abs(o.weeklyChange))}%
                  </span>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <Card variant="oil" icon="🛢️" title={t('oilMarket')} badge={t('badgeCrude')}>
      {renderContent()}
    </Card>
  );
}
