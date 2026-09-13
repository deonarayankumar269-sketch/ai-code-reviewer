import { useTheme } from '../../context/ThemeContext';

export default function Spinner({ label }) {
  const { tokens } = useTheme();

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="w-8 h-8 rounded-full animate-spin"
        style={{
          border: `2px solid ${tokens.lineColor}`,
          borderTopColor: tokens.accent,
        }}
      />
      {label && <span className="text-sm" style={{ color: tokens.textMuted }}>{label}</span>}
    </div>
  );
}