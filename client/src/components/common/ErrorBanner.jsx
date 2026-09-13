import { AlertCircle } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function ErrorBanner({ message }) {
  const { tokens } = useTheme();
  if (!message) return null;

  return (
    <div
      className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm"
      style={{
        backgroundColor: tokens.cardBg,
        border: `1px solid ${tokens.error}55`,
        color: tokens.error,
      }}
    >
      <AlertCircle size={16} className="shrink-0" />
      <span>{message}</span>
    </div>
  );
}