import { AlertCircle } from 'lucide-react';

export default function ErrorBanner({ message }) {
  if (!message) return null;
  return (
    <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-red-950/50 border border-red-900 text-red-400 text-sm">
      <AlertCircle size={16} className="shrink-0" />
      <span>{message}</span>
    </div>
  );
}