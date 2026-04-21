import Card from './Card';
import Skeleton from '../Skeleton';
import { fmt, cc, arrow } from '../../utils/format';

export default function StocksCard({ data, loading, currentView }) {
  const isWeekly = currentView === 'weekly';

  const renderContent = () => {
    if (loading) return <Skeleton rows={8} />;

    if (!data || data.length === 0) {
      return (
        <div className="empty-state">
          <div className="empty-icon">📊</div>
          <p>{data === null ? 'Failed to load stock data' : 'Click "Collect Data" to fetch market data'}</p>
        </div>
      );
    }

    return (
      <table className="data-table fade-in">
        <thead>
          <tr>
            <th>Index</th>
            <th>Price</th>
            <th>24h</th>
            {isWeekly && <th>7d</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((s) => (
            <tr key={s.symbol}>
              <td>
                <span className="symbol-name">{s.name}</span>
              </td>
              <td className="price">
                {s.price != null ? fmt(s.price, s.price > 10000 ? 0 : 2) : 'N/A'}
              </td>
              <td>
                <span className={`change ${cc(s.dailyChange)}`}>
                  {arrow(s.dailyChange)}{' '}
                  {s.dailyChange != null
                    ? fmt(Math.abs(s.dailyChange)) + '%'
                    : 'N/A'}
                </span>
              </td>
              {isWeekly && (
                <td>
                  <span className={`change ${cc(s.weeklyChange)}`}>
                    {arrow(s.weeklyChange)}{' '}
                    {s.weeklyChange != null
                      ? fmt(Math.abs(s.weeklyChange)) + '%'
                      : 'N/A'}
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
    <Card variant="stocks" icon="📈" title="Stock Indices" badge="LIVE">
      {renderContent()}
    </Card>
  );
}
