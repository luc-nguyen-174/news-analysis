import Card from './Card';
import Skeleton from '../Skeleton';
import { fmt, fmtLarge, cc, arrow } from '../../utils/format';
import { useI18n } from '../../i18n';

export default function CryptoCard({ data, globalData, loading, currentView }) {
  const { t } = useI18n();
  const isWeekly = currentView === 'weekly';

  const renderContent = () => {
    if (loading) return <Skeleton rows={10} />;

    if (!data) {
      return (
        <div className="empty-state">
          <div className="empty-icon">🪙</div>
          <p>{data === null ? t('failedCrypto') : t('emptyCrypto')}</p>
        </div>
      );
    }

    return (
      <div className="fade-in">
        {globalData && (
          <div className="crypto-stats">
            <div className="stat-box">
              <div className="stat-label">{t('totalMarketCap')}</div>
              <div className="stat-value">
                {fmtLarge(globalData.total_market_cap?.usd)}
              </div>
            </div>
            <div className="stat-box">
              <div className="stat-label">{t('btcDominance')}</div>
              <div className="stat-value">
                {globalData.market_cap_percentage?.btc != null
                  ? fmt(globalData.market_cap_percentage.btc, 1) + '%'
                  : 'N/A'}
              </div>
            </div>
            <div className="stat-box">
              <div className="stat-label">24h Volume</div>
              <div className="stat-value">
                {fmtLarge(globalData.total_volume?.usd)}
              </div>
            </div>
          </div>
        )}

        <table className="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>{t('colCoin')}</th>
              <th>{t('colPrice')}</th>
              <th>{t('col24h')}</th>
              {isWeekly && <th>{t('col7d')}</th>}
              <th>{t('colMarketCap')}</th>
            </tr>
          </thead>
          <tbody>
            {data.map((coin, i) => {
              const dc = coin.price_change_percentage_24h;
              const wc = coin.price_change_percentage_7d_in_currency;
              return (
                <tr key={coin.id}>
                  <td style={{ color: 'var(--text-muted)' }}>{i + 1}</td>
                  <td>
                    <img
                      className="crypto-logo"
                      src={coin.image}
                      alt={coin.symbol}
                      loading="lazy"
                    />
                    <span className="symbol-name">
                      {coin.symbol.toUpperCase()}
                    </span>
                    <span className="symbol-label">{coin.name}</span>
                  </td>
                  <td className="price">
                    ${fmt(coin.current_price, coin.current_price < 1 ? 4 : 2)}
                  </td>
                  <td>
                    <span className={`change ${cc(dc)}`}>
                      {arrow(dc)}{' '}
                      {dc != null ? fmt(Math.abs(dc)) + '%' : 'N/A'}
                    </span>
                  </td>
                  {isWeekly && (
                    <td>
                      <span className={`change ${cc(wc)}`}>
                        {arrow(wc)}{' '}
                        {wc != null ? fmt(Math.abs(wc)) + '%' : 'N/A'}
                      </span>
                    </td>
                  )}
                  <td className="meta-text">{fmtLarge(coin.market_cap)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <Card variant="crypto" icon="₿" title={t('cryptoMarket')} badge={t('badgeTop10')}>
      {renderContent()}
    </Card>
  );
}
