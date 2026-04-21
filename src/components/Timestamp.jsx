import { useI18n } from '../i18n';

export default function Timestamp({ lastUpdated }) {
  const { t } = useI18n();
  if (!lastUpdated) return null;
  return (
    <div className="timestamp" id="lastUpdated">
      <span className="timestamp-dot" />
      {t('lastUpdated')}: {lastUpdated}
    </div>
  );
}
