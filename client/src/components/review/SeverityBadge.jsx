import { memo } from 'react';

const SEVERITY_STYLES = {
  critical: { background: '#7f1d1d', color: '#fecaca' },
  high: { background: '#9a3412', color: '#fed7aa' },
  medium: { background: '#854d0e', color: '#fef08a' },
  low: { background: '#1e3a8a', color: '#bfdbfe' },
  info: { background: '#374151', color: '#e5e7eb' },
};

function SeverityBadge({ severity }) {
  const style = SEVERITY_STYLES[severity] || SEVERITY_STYLES.info;
  return (
    <span
      className="severity-badge"
      style={{ ...style, padding: '2px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 600 }}
    >
      {severity.toUpperCase()}
    </span>
  );
}

export default memo(SeverityBadge);