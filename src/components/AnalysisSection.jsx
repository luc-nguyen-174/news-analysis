import { useMemo } from 'react';
import { analyzeMarketData } from '../utils/analysis';

/**
 * Signal badge component.
 */
function SignalBadge({ signal }) {
  if (!signal) return null;
  return (
    <span
      className="analysis-signal"
      style={{
        color: signal.color,
        background: `${signal.color}15`,
        borderColor: `${signal.color}30`,
      }}
    >
      {signal.icon} {signal.label}
    </span>
  );
}

/**
 * Individual asset analysis card.
 */
function AnalysisCard({ analysis }) {
  return (
    <div className="analysis-card">
      <div className="analysis-card-header">
        <span className="analysis-card-icon">{analysis.icon}</span>
        <span className="analysis-card-title">{analysis.category}</span>
        <SignalBadge signal={analysis.signal} />
      </div>
      <ul className="analysis-insights">
        {analysis.insights.map((insight, i) => (
          <li key={i} className="analysis-insight">
            {insight}
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Score gauge visualization.
 */
function ScoreGauge({ score, signal }) {
  // Map score from [-2, 2] to [0, 100] for the gauge
  const percentage = Math.min(100, Math.max(0, ((score + 2) / 4) * 100));

  return (
    <div className="score-gauge">
      <div className="score-gauge-track">
        <div
          className="score-gauge-fill"
          style={{
            width: `${percentage}%`,
            background: `linear-gradient(90deg, #ff1744, #ff6e40, #ffd740, #69f0ae, #00e676)`,
          }}
        />
        <div
          className="score-gauge-marker"
          style={{ left: `${percentage}%` }}
        />
      </div>
      <div className="score-gauge-labels">
        <span style={{ color: '#ff1744' }}>Bearish</span>
        <span style={{ color: '#ffd740' }}>Neutral</span>
        <span style={{ color: '#00e676' }}>Bullish</span>
      </div>
    </div>
  );
}

export default function AnalysisSection({ allData, loading }) {
  const analysis = useMemo(() => {
    if (!allData || loading) return null;
    // Only run analysis if we have at least some data
    const hasData = allData.stocks || allData.crypto || allData.fng || allData.gold;
    if (!hasData) return null;
    return analyzeMarketData(allData);
  }, [allData, loading]);

  if (!analysis) {
    return (
      <div className="analysis-section">
        <div className="analysis-header">
          <div className="analysis-header-brand">
            <span className="analysis-header-icon">🔬</span>
            <h2 className="analysis-header-title">Market Analysis</h2>
          </div>
          <span className="analysis-header-badge">AI</span>
        </div>
        <div className="empty-state">
          <div className="empty-icon">📊</div>
          <p>Click "Collect Data" to generate market analysis</p>
        </div>
      </div>
    );
  }

  return (
    <div className="analysis-section fade-in">
      <div className="analysis-header">
        <div className="analysis-header-brand">
          <span className="analysis-header-icon">🔬</span>
          <h2 className="analysis-header-title">Market Analysis</h2>
        </div>
        <span className="analysis-header-subtitle">
          Data-driven outlook based on current market signals
        </span>
        <span className="analysis-header-badge">ANALYSIS</span>
      </div>

      {/* Overall Outlook */}
      <div className="analysis-outlook-grid">
        {/* Short-Term */}
        <div className="outlook-card">
          <div className="outlook-card-label">
            <span className="outlook-label-icon">⚡</span>
            SHORT-TERM OUTLOOK (1-7 days)
          </div>
          <div
            className="outlook-card-title"
            style={{ color: analysis.shortTermOutlook.color }}
          >
            {analysis.shortTermOutlook.outlook}
          </div>
          <p className="outlook-card-desc">
            {analysis.shortTermOutlook.description}
          </p>
          <div className="outlook-gauge">
            <ScoreGauge
              score={analysis.overallScore}
              signal={analysis.overallSignal}
            />
          </div>
        </div>

        {/* Long-Term */}
        <div className="outlook-card">
          <div className="outlook-card-label">
            <span className="outlook-label-icon">🔭</span>
            LONG-TERM OUTLOOK (1-6 months)
          </div>
          <ul className="outlook-points">
            {analysis.longTermOutlook.map((point, i) => (
              <li key={i} className="outlook-point">
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Cross-Market Insights */}
      {analysis.crossInsights.length > 0 && (
        <div className="cross-insights">
          <div className="cross-insights-title">🔗 Cross-Market Signals</div>
          {analysis.crossInsights.map((insight, i) => (
            <div
              key={i}
              className={`cross-insight cross-insight--${insight.type}`}
            >
              {insight.text}
            </div>
          ))}
        </div>
      )}

      {/* Per-Asset Analysis */}
      <div className="analysis-grid">
        {analysis.analyses.map((a) => (
          <AnalysisCard key={a.category} analysis={a} />
        ))}
      </div>

      <div className="analysis-disclaimer">
        ⚠️ This analysis is algorithmic and based on publicly available data.
        Not financial advice. Always do your own research.
      </div>
    </div>
  );
}
