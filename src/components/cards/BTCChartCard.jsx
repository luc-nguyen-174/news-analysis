import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import Card from './Card';
import Skeleton from '../Skeleton';
import { fmt, arrow } from '../../utils/format';
import { useI18n } from '../../i18n';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip);

export default function BTCChartCard({ sparkline, loading }) {
  const { t } = useI18n();

  const renderContent = () => {
    if (loading) return <Skeleton rows={4} />;

    if (!sparkline || sparkline.length === 0) {
      return (
        <div className="empty-state">
          <div className="empty-icon">📈</div>
          <p>
            {sparkline === null ? t('failedBtcChart') : t('emptyBtcChart')}
          </p>
        </div>
      );
    }

    const step = Math.max(1, Math.floor(sparkline.length / 100));
    const sampled = sparkline.filter((_, i) => i % step === 0);
    const labels = sampled.map((p) => {
      const d = new Date(p[0]);
      return (
        d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) +
        ' ' +
        d.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })
      );
    });
    const prices = sampled.map((p) => p[1]);
    const start = prices[0];
    const end = prices[prices.length - 1];
    const isUp = end >= start;
    const lineColor = isUp ? '#00e676' : '#ff1744';
    const bgColor = isUp ? 'rgba(0,230,118,0.08)' : 'rgba(255,23,68,0.08)';

    const chartData = {
      labels,
      datasets: [
        {
          data: prices,
          borderColor: lineColor,
          borderWidth: 2,
          fill: true,
          backgroundColor: bgColor,
          pointRadius: 0,
          pointHitRadius: 10,
          tension: 0.3,
        },
      ],
    };

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          mode: 'index',
          intersect: false,
          backgroundColor: '#1e1e2a',
          titleColor: '#e8e8f0',
          bodyColor: '#e8e8f0',
          borderColor: '#2a2a3a',
          borderWidth: 1,
          padding: 10,
          titleFont: { family: 'JetBrains Mono', size: 11 },
          bodyFont: { family: 'JetBrains Mono', size: 12 },
          callbacks: {
            label: (ctx) => `$${fmt(ctx.parsed.y, 2)}`,
          },
        },
      },
      scales: {
        x: {
          display: true,
          grid: { color: 'rgba(42,42,58,0.3)', drawBorder: false },
          ticks: {
            color: '#606078',
            font: { family: 'JetBrains Mono', size: 9 },
            maxTicksLimit: 6,
            maxRotation: 0,
          },
        },
        y: {
          display: true,
          grid: { color: 'rgba(42,42,58,0.3)', drawBorder: false },
          ticks: {
            color: '#606078',
            font: { family: 'JetBrains Mono', size: 10 },
            callback: (v) => '$' + (v / 1000).toFixed(1) + 'k',
          },
        },
      },
      interaction: { mode: 'nearest', axis: 'x', intersect: false },
    };

    return (
      <div className="fade-in">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            marginBottom: '8px',
          }}
        >
          <span className="price" style={{ fontSize: '1.2rem' }}>
            ${fmt(end, 2)}
          </span>
          <span className={`change ${isUp ? 'up' : 'down'}`}>
            {arrow(end - start)}{' '}
            {fmt(Math.abs(((end - start) / start) * 100))}% ({t('btc7dChange')})
          </span>
        </div>
        <div className="chart-container">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>
    );
  };

  return (
    <Card variant="btc-chart" icon="📉" title={t('btcSparkline')} badge={t('badgeChart')}>
      {renderContent()}
    </Card>
  );
}
