import axiosClient from '../api/axiosClient';
import { useState, useCallback } from 'react';
import { LogOut } from 'lucide-react';
import CodeEditor from '../components/editor/CodeEditor';
import ReviewResult from '../components/review/ReviewResult';
import ErrorBanner from '../components/common/ErrorBanner';
import Spinner from '../components/common/Spinner';
import ThemeToggle from '../components/common/ThemeToggle';
import { useReview } from '../hooks/useReview';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import ReviewHistoryList from '../components/review/ReviewHistoryList';

export default function Dashboard() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const { result, isSubmitting, error, submitReview } = useReview();
  const { user, logout } = useAuth();
  const { tokens } = useTheme();
  const [historyRefreshKey, setHistoryRefreshKey] = useState(0);

  const handleCodeChange = useCallback((value) => setCode(value), []);
  const handleLanguageChange = useCallback((value) => setLanguage(value), []);

  const handleSubmit = async () => {
    if (code.trim().length < 10) return;
    try {
      await submitReview(language, code);
      setHistoryRefreshKey((prev) => prev + 1);
    } catch {
      // error state already surfaced via the hook
    }
  };

  return (
    <div
      className="min-h-screen transition-colors"
      style={{ backgroundColor: tokens.dashboardBg, fontFamily: "'IBM Plex Sans', sans-serif" }}
    >
      <header
        className="relative overflow-hidden px-6 py-4 flex items-center justify-between"
        style={{ borderBottom: `1px solid ${tokens.lineColor}` }}
      >
        <div
          className="absolute -top-24 -left-10 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: `radial-gradient(circle, ${tokens.accent}33 0%, transparent 70%)` }}
        />
        <h1 className="relative text-lg font-semibold" style={{ color: tokens.textPrimary }}>
          AI Code Reviewer
        </h1>
        <div className="relative flex items-center gap-4">
          <span className="text-sm" style={{ color: tokens.textSecondary }}>{user?.email}</span>
          <ThemeToggle />
          <button
            onClick={logout}
            className="flex items-center gap-1.5 text-sm transition-colors"
            style={{ color: tokens.textSecondary }}
            onMouseEnter={(e) => (e.currentTarget.style.color = tokens.textPrimary)}
            onMouseLeave={(e) => (e.currentTarget.style.color = tokens.textSecondary)}
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {error && <ErrorBanner message={error} />}

        <div
          className="mt-4 rounded-xl overflow-hidden"
          style={{ border: `1px solid ${tokens.lineColor}` }}
        >
          <CodeEditor
            code={code}
            language={language}
            onCodeChange={handleCodeChange}
            onLanguageChange={handleLanguageChange}
            disabled={isSubmitting}
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={isSubmitting || code.trim().length < 10}
          className="mt-4 w-full py-3 rounded-xl font-medium transition-opacity disabled:opacity-40"
          style={{ backgroundColor: tokens.buttonBg, color: tokens.buttonText }}
        >
          {isSubmitting ? 'Analyzing...' : 'Review code'}
        </button>

        {isSubmitting && (
          <div className="mt-6 flex justify-center">
            <Spinner label="Running static + AI analysis..." />
          </div>
        )}

        {result && (
          <div className="mt-8">
            <ReviewResult review={result} />
          </div>
        )}

        <div className="mt-10 pt-8" style={{ borderTop: `1px solid ${tokens.lineColor}` }}>
          <h2 className="text-sm font-medium mb-4 tracking-wide" style={{ color: tokens.accent }}>
            Review history
          </h2>
          <ReviewHistoryList
            key={historyRefreshKey}
            onSelectReview={async (id) => {
              const { data } = await axiosClient.get(`/reviews/${id}`);
              setCode(data.data.code);
              setLanguage(data.data.language);
            }}
          />
        </div>
      </main>
    </div>
  );
}