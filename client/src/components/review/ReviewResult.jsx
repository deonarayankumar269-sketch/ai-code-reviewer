import { memo, useMemo } from 'react';
import SeverityBadge from './SeverityBadge';
import { useTheme } from '../../context/ThemeContext';

const SEVERITY_ORDER = { critical: 0, high: 1, medium: 2, low: 3, info: 4 };

function ReviewResult({ review }) {
  const { tokens } = useTheme();

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
    <div>
      <div
        className="flex items-center gap-5 rounded-xl p-5 mb-6"
        style={{ backgroundColor: tokens.cardBg, border: `1px solid ${tokens.cardBorder}` }}
      >
        <div
          className="shrink-0 w-16 h-16 rounded-full flex items-center justify-center text-lg font-semibold"
          style={{ border: `2px solid ${tokens.accent}`, color: tokens.textPrimary }}
        >
          {review.overallScore}
          <span className="text-xs font-normal ml-0.5" style={{ color: tokens.textMuted }}>/100</span>
        </div>
        <div className="flex-1">
          <p className="text-sm mb-2" style={{ color: tokens.textPrimary }}>{review.summary}</p>
          <div className="flex gap-4 text-xs" style={{ color: tokens.textSecondary }}>
            <span>Time: <strong style={{ color: tokens.textPrimary }}>{review.timeComplexity}</strong></span>
            <span>Space: <strong style={{ color: tokens.textPrimary }}>{review.spaceComplexity}</strong></span>
          </div>
        </div>
      </div>

      {Object.entries(groupedByType).map(([type, findings]) => (
        <section key={type} className="mb-6">
          <h3 className="text-sm font-medium mb-3" style={{ color: tokens.accent }}>
            {type.charAt(0).toUpperCase() + type.slice(1)} ({findings.length})
          </h3>
          <div className="space-y-3">
            {findings.map((finding, idx) => (
              <div
                key={`${type}-${idx}`}
                className="rounded-lg p-4"
                style={{ backgroundColor: tokens.cardBg, border: `1px solid ${tokens.cardBorder}` }}
              >
                <div className="flex items-center gap-2.5 mb-2 flex-wrap">
                  <SeverityBadge severity={finding.severity} />
                  <span className="text-sm font-medium" style={{ color: tokens.textPrimary }}>
                    {finding.title}
                  </span>
                  {finding.line !== null && (
                    <span className="text-xs" style={{ color: tokens.textMuted }}>
                      Line {finding.line}
                    </span>
                  )}
                </div>
                <p className="text-sm mb-1.5" style={{ color: tokens.textSecondary }}>
                  {finding.description}
                </p>
                {finding.suggestion && (
                  <p className="text-sm" style={{ color: tokens.textSecondary }}>
                    <strong style={{ color: tokens.textPrimary }}>Suggestion:</strong> {finding.suggestion}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      ))}

      {sortedFindings.length === 0 && (
        <p className="text-sm text-center py-6" style={{ color: tokens.textSecondary }}>
          No issues detected. Great work!
        </p>
      )}
    </div>
  );
}

export default memo(ReviewResult);