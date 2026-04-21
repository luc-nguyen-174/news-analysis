import { useI18n } from '../i18n';

export default function ControlsBar({
  loading,
  currentView,
  autoRefreshOn,
  onCollect,
  onSetView,
  onToggleAutoRefresh,
  onExportPNG,
  onExportJSON,
}) {
  const { t } = useI18n();
  return (
    <div className="controls-bar">
      <button
        className={`btn-collect${loading ? ' loading' : ''}`}
        id="btnCollect"
        onClick={onCollect}
        disabled={loading}
      >
        <span className="spinner" />
        <span className="btn-icon">🔄</span>
        {t('collectData')}
      </button>

      <button
        className={`btn-toggle${currentView === 'daily' ? ' active' : ''}`}
        id="btnDaily"
        onClick={() => onSetView('daily')}
      >
        {t('todaySnapshot')}
      </button>

      <button
        className={`btn-toggle${currentView === 'weekly' ? ' active' : ''}`}
        id="btnWeekly"
        onClick={() => onSetView('weekly')}
      >
        {t('weeklyOverview')}
      </button>

      <div className="auto-refresh-group">
        <span className="auto-refresh-label">{t('autoRefresh')}</span>
        <label className="switch">
          <input
            type="checkbox"
            id="autoRefreshToggle"
            checked={autoRefreshOn}
            onChange={onToggleAutoRefresh}
          />
          <span className="slider" />
        </label>
      </div>

      <button className="btn-secondary" onClick={onExportPNG}>
        📸 {t('exportPNG')}
      </button>
      <button className="btn-secondary" onClick={onExportJSON}>
        💾 {t('exportJSON')}
      </button>
    </div>
  );
}
