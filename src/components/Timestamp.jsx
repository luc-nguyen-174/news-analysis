export default function Timestamp({ lastUpdated }) {
  return (
    <div className={`timestamp${lastUpdated ? ' visible' : ''}`} id="timestamp">
      <span className="dot" />
      Last updated: <span id="lastUpdated">{lastUpdated || '—'}</span>
    </div>
  );
}
