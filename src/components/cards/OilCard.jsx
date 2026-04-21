import Card from './Card';
import Skeleton from '../Skeleton';
import { fmt, cc, arrow } from '../../utils/format';

export default function OilCard({ data, loading, currentView }) {
  const isWeekly = currentView === 'weekly';

  const renderContent = () => {
    if (loading) return <Skeleton rows={4} />;

    if (!data || data.length === 0) {
      return (
        <div className="empty-state">
          <div className="empty-icon">⛽</div>
          <p>{data === null ? 'Failed to load oil data' : 'Click "Collect Data" to fetch oil prices'}</p>
        </div>
      );
    }

    return (
      <table className="data-table fade-in">
        <thead>
          <tr>
            <th>Type</th>
            <th>Price</th>
            <th>24h</th>
            {isWeekly && <th>7d</th>}
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
    <Card variant="oil" icon="🛢️" title="Oil Market" badge="CRUDE">
      {renderContent()}
    </Card>
  );
}
