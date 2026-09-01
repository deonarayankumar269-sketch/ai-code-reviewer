import { memo, useMemo } from 'react';
import SeverityBadge from './SeverityBadge';

const SEVERITY_ORDER = { critical: 0, high: 1, medium: 2, low: 3, info: 4 };

function ReviewResult({ review }) {
  // Sort once via useMemo instead of re-sorting every render — O(N log N)
  // only recomputed when the findings array reference changes.
  const sortedFindings = useMemo(() => {
    if (!review?.findings) return [];
    return [...review.findings].sort(
      (a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]
    );
  }, [review?.findings]);

  const groupedByType = useMemo(() => {
    const groups = {};
    for (const finding of sortedFindings) {
      if (!groups[finding.type]) groups[finding.type] = [];
      groups[finding.type].push(finding);
    }
    return groups;
  }, [sortedFindings]);

  if (!review) return null;

  return (
    <div className="review-result">
      <div className="review-summary-card">
        <div className="score-circle">{review.overallScore}<span>/100</span></div>
        <p className="summary-text">{review.summary}</p>
        <div className="complexity-row">
          <span>Time: <strong>{review.timeComplexity}</strong></span>
          <span>Space: <strong>{review.spaceComplexity}</strong></span>
        </div>
      </div>

      {Object.entries(groupedByType).map(([type, findings]) => (
        <section key={type} className="findings-group">
          <h3>{type.charAt(0).toUpperCase() + type.slice(1)} ({findings.length})</h3>
          {findings.map((finding, idx) => (
            <div key={`${type}-${idx}`} className="finding-card">
              <div className="finding-header">
                <SeverityBadge severity={finding.severity} />
                <span className="finding-title">{finding.title}</span>
                {finding.line !== null && <span className="finding-line">Line {finding.line}</span>}
              </div>
              <p className="finding-description">{finding.description}</p>
              {finding.suggestion && (
                <p className="finding-suggestion"><strong>Suggestion:</strong> {finding.suggestion}</p>
              )}
            </div>
          ))}
        </section>
      ))}

      {sortedFindings.length === 0 && (
        <p className="no-findings">No issues detected. Great work!</p>
      )}
    </div>
  );
}

export default memo(ReviewResult);