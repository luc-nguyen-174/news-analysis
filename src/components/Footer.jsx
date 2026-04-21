import { useI18n } from '../i18n';

export default function Footer() {
  const { t } = useI18n();
  return (
    <div className="footer">
      <p>
        {t('footerDataFrom')}{' '}
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
        {t('footerDisclaimer')}
      </p>
    </div>
  );
}
