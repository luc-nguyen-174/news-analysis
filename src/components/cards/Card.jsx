export default function Card({ variant, icon, title, badge, children }) {
  return (
    <div className={`card card--${variant}`}>
      <div className="card-header">
        <span className="card-icon">{icon}</span>
        <span className="card-title">{title}</span>
        <span className="card-badge">{badge}</span>
      </div>
      {children}
    </div>
  );
}
