import Card from './Card';
import Skeleton from '../Skeleton';
import { fmt, cc, arrow } from '../../utils/format';
import { useI18n } from '../../i18n';

export default function ForexCard({ data, loading, currentView }) {
  const { t } = useI18n();
  const isWeekly = currentView === 'weekly';

  const renderContent = () => {
    if (loading) return <Skeleton rows={5} />;

    if (!data) {
      return (
        <div className="empty-state">
          <div className="empty-icon">💹</div>
          <p>{data === null ? t('failedForex') : t('emptyForex')}</p>
        </div>
      );
    }

    return (
      <table className="data-table fade-in">
        <thead>
          <tr>
            <th>{t('colPair')}</th>
            <th>{t('colRate')}</th>
            {isWeekly && <th>{t('col7d')}</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((p) => {
            const wc = p.weekRate
              ? ((p.rate - p.weekRate) / p.weekRate) * 100
              : null;
            return (
              <tr key={p.pair}>
                <td>
                  <span className="symbol-name">{p.pair}</span>
                </td>
                <td className="price">
                  {p.rate != null
                    ? fmt(p.rate, p.pair === 'USD/VND' ? 0 : 4)
                    : 'N/A'}
                </td>
                {isWeekly && (
                  <td>
                    <span className={`change ${cc(wc)}`}>
                      {wc != null
                        ? `${arrow(wc)} ${fmt(Math.abs(wc))}%`
                        : 'N/A'}
                    </span>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  return (
    <Card variant="forex" icon="💱" title={t('forexRates')} badge={t('badgeFx')}>
      {renderContent()}
    </Card>
  );
}
