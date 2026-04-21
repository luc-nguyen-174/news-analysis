import LangSwitcher from './LangSwitcher';
import { useI18n } from '../i18n';

export default function Header() {
  const { t } = useI18n();
  return (
    <header className="header">
      <LangSwitcher />
      <div className="header-brand">
        <span className="header-logo">📊</span>
        <h1>{t('appName')}</h1>
      </div>
      <p className="header-subtitle">{t('subtitle')}</p>
    </header>
  );
}
