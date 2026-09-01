import axiosClient from '../api/axiosClient';
import { useState, useCallback } from 'react';
import { LogOut } from 'lucide-react';
import CodeEditor from '../components/editor/CodeEditor';
import ReviewResult from '../components/review/ReviewResult';
import ErrorBanner from '../components/common/ErrorBanner';
import Spinner from '../components/common/Spinner';
import { useReview } from '../hooks/useReview';
import { useAuth } from '../context/AuthContext';
import ReviewHistoryList from '../components/review/ReviewHistoryList';

export default function Dashboard() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const { result, isSubmitting, error, submitReview } = useReview();
  const { user, logout } = useAuth();
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
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
        <h1 className="text-xl font-bold">AI Code Reviewer</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-400">{user?.email}</span>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {error && <ErrorBanner message={error} />}

        <div className="mt-4 rounded-xl overflow-hidden border border-slate-800">
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
          className="mt-4 w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold transition-colors"
        >
          {isSubmitting ? 'Analyzing...' : 'Review Code'}
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

        <div className="mt-10 pt-8 border-t border-slate-800">
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