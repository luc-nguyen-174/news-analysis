import Card from './Card';
import Skeleton from '../Skeleton';
import { fmt, cc, arrow } from '../../utils/format';

export default function ForexCard({ data, loading, currentView }) {
  const isWeekly = currentView === 'weekly';

  const renderContent = () => {
    if (loading) return <Skeleton rows={5} />;

    if (!data) {
      return (
        <div className="empty-state">
          <div className="empty-icon">💹</div>
          <p>{data === null ? 'Failed to load forex data' : 'Click "Collect Data" to fetch rates'}</p>
        </div>
      );
    }

    return (
      <table className="data-table fade-in">
        <thead>
          <tr>
            <th>Pair</th>
            <th>Rate</th>
            {isWeekly && <th>7d</th>}
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
    <Card variant="forex" icon="💱" title="Forex Rates" badge="FX">
      {renderContent()}
    </Card>
  );
}
