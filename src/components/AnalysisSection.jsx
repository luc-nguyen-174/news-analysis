import { useMemo } from 'react';
import { analyzeMarketData } from '../utils/analysis';
import { useI18n } from '../i18n';

/**
 * Signal badge component.
 */
function SignalBadge({ signal, t }) {
  if (!signal) return null;
  // Use localized label
  const labelMap = {
    'Strong Bullish': t('signalStrongBull'),
    'Bullish': t('signalBull'),
    'Neutral': t('signalNeutral'),
    'Bearish': t('signalBear'),
    'Strong Bearish': t('signalStrongBear'),
  };
  const label = labelMap[signal.label] || signal.label;
  return (
    <span
      className="analysis-signal"
      style={{
        color: signal.color,
        background: `${signal.color}15`,
        borderColor: `${signal.color}30`,
      }}
    >
      {signal.icon} {label}
    </span>
  );
}

/**
 * Individual asset analysis card.
 */
function AnalysisCard({ analysis, t }) {
  return (
    <div className="analysis-card">
      <div className="analysis-card-header">
        <span className="analysis-card-icon">{analysis.icon}</span>
        <span className="analysis-card-title">{analysis.category}</span>
        <SignalBadge signal={analysis.signal} t={t} />
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
function ScoreGauge({ score, t }) {
  const percentage = Math.min(100, Math.max(0, ((score + 2) / 4) * 100));
  const gaugeLabels = t('gaugeLabel');

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
        <span style={{ color: '#ff1744' }}>{gaugeLabels.bearish}</span>
        <span style={{ color: '#ffd740' }}>{gaugeLabels.neutral}</span>
        <span style={{ color: '#00e676' }}>{gaugeLabels.bullish}</span>
      </div>
    </div>
  );
}

export default function AnalysisSection({ allData, loading }) {
  const { t } = useI18n();

  const analysis = useMemo(() => {
    if (!allData || loading) return null;
    const hasData = allData.stocks || allData.crypto || allData.fng || allData.gold;
    if (!hasData) return null;
    return analyzeMarketData(allData);
  }, [allData, loading]);

  // Map outlook keys to i18n
  const outlookI18n = useMemo(() => ({
    'Risk-On Rally': { title: t('outlookRiskOnRally'), desc: t('outlookRiskOnDesc') },
    'Cautiously Bullish': { title: t('outlookCautiousBull'), desc: t('outlookCautiousBullDesc') },
    'Range-Bound / Mixed': { title: t('outlookRangeBound'), desc: t('outlookRangeBoundDesc') },
    'Cautiously Bearish': { title: t('outlookCautiousBear'), desc: t('outlookCautiousBearDesc') },
    'Risk-Off / Defensive': { title: t('outlookRiskOff'), desc: t('outlookRiskOffDesc') },
  }), [t]);

  if (!analysis) {
    return (
      <div className="analysis-section">
        <div className="analysis-header">
          <div className="analysis-header-brand">
            <span className="analysis-header-icon">🔬</span>
            <h2 className="analysis-header-title">{t('marketAnalysis')}</h2>
          </div>
          <span className="analysis-header-badge">AI</span>
        </div>
        <div className="empty-state">
          <div className="empty-icon">📊</div>
          <p>{t('emptyAnalysis')}</p>
        </div>
      </div>
    );
  }

  const localizedOutlook = outlookI18n[analysis.shortTermOutlook.outlook] || {};

  return (
    <div className="analysis-section fade-in">
      <div className="analysis-header">
        <div className="analysis-header-brand">
          <span className="analysis-header-icon">🔬</span>
          <h2 className="analysis-header-title">{t('marketAnalysis')}</h2>
        </div>
        <span className="analysis-header-subtitle">
          {t('analysisSubtitle')}
        </span>
        <span className="analysis-header-badge">{t('analysisBadge')}</span>
      </div>

      {/* Overall Outlook */}
      <div className="analysis-outlook-grid">
        {/* Short-Term */}
        <div className="outlook-card">
          <div className="outlook-card-label">
            <span className="outlook-label-icon">⚡</span>
            {t('shortTermOutlook')}
          </div>
          <div
            className="outlook-card-title"
            style={{ color: analysis.shortTermOutlook.color }}
          >
            {localizedOutlook.title || analysis.shortTermOutlook.outlook}
          </div>
          <p className="outlook-card-desc">
            {localizedOutlook.desc || analysis.shortTermOutlook.description}
          </p>
          <div className="outlook-gauge">
            <ScoreGauge score={analysis.overallScore} t={t} />
          </div>
        </div>

        {/* Long-Term */}
        <div className="outlook-card">
          <div className="outlook-card-label">
            <span className="outlook-label-icon">🔭</span>
            {t('longTermOutlook')}
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
          <div className="cross-insights-title">{t('crossMarketSignals')}</div>
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
          <AnalysisCard key={a.category} analysis={a} t={t} />
        ))}
      </div>

      <div className="analysis-disclaimer">
        {t('analysisDisclaimer')}
      </div>
    </div>
  );
}
