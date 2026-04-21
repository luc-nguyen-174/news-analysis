const widths = ['w60', 'w80', 'w40'];

export default function Skeleton({ rows = 5 }) {
  return (
    <div className="skeleton" style={{ padding: '12px' }}>
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className={`skeleton-line ${widths[i % 3]}`} />
      ))}
    </div>
  );
}
