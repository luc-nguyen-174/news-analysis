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
        Collect Data
      </button>

      <button
        className={`btn-toggle${currentView === 'daily' ? ' active' : ''}`}
        id="btnDaily"
        onClick={() => onSetView('daily')}
      >
        Today's Snapshot
      </button>

      <button
        className={`btn-toggle${currentView === 'weekly' ? ' active' : ''}`}
        id="btnWeekly"
        onClick={() => onSetView('weekly')}
      >
        Weekly Overview
      </button>

      <div className="auto-refresh-group">
        <span className="auto-refresh-label">Auto-refresh</span>
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
        📸 Export PNG
      </button>
      <button className="btn-secondary" onClick={onExportJSON}>
        💾 Export JSON
      </button>
    </div>
  );
}
