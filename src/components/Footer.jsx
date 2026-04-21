export default function Footer() {
  return (
    <div className="footer">
      <p>
        MarketPulse Dashboard — Data from{' '}
        <a href="https://www.coingecko.com" target="_blank" rel="noreferrer">
          CoinGecko
        </a>
        ,{' '}
        <a href="https://finance.yahoo.com" target="_blank" rel="noreferrer">
          Yahoo Finance
        </a>
        ,{' '}
        <a href="https://frankfurter.app" target="_blank" rel="noreferrer">
          Frankfurter
        </a>
        ,{' '}
        <a href="https://alternative.me" target="_blank" rel="noreferrer">
          Alternative.me
        </a>
      </p>
      <p style={{ marginTop: '4px' }}>
        All data is delayed and for informational purposes only. Not financial advice.
      </p>
    </div>
  );
}
