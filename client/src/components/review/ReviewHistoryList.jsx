import { useState, useEffect, useCallback } from 'react';
import { Clock, ChevronRight } from 'lucide-react';
import axiosClient from '../../api/axiosClient';
import SeverityBadge from './SeverityBadge';
import Spinner from '../common/Spinner';
import ErrorBanner from '../common/ErrorBanner';
import { useTheme } from '../../context/ThemeContext';

const SEVERITY_ORDER = { critical: 0, high: 1, medium: 2, low: 3, info: 4 };

function highestSeverity(review) {
  if (!review.findings || review.findings.length === 0) return null;
  return review.findings.reduce((worst, f) => {
    if (!worst) return f.severity;
    return SEVERITY_ORDER[f.severity] < SEVERITY_ORDER[worst] ? f.severity : worst;
  }, null);
}

export default function ReviewHistoryList({ onSelectReview }) {
  const { tokens } = useTheme();
  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReviews = useCallback(async (pageNum) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await axiosClient.get('/reviews', {
        params: { page: pageNum, limit: 10 },
      });
      setReviews(data.data.items);
      setPages(data.data.pages);
      setPage(data.data.page);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load review history.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews(1);
  }, [fetchReviews]);

  if (isLoading && reviews.length === 0) {
    return (
      <div className="flex justify-center py-10">
        <Spinner label="Loading history..." />
      </div>
    );
  }

  if (error) return <ErrorBanner message={error} />;

  if (reviews.length === 0) {
    return (
      <p className="text-center text-sm py-10" style={{ color: tokens.textMuted }}>
        No reviews yet. Submit your first code snippet above.
      </p>
    );
  }

  return (
    <div>
      <div className="space-y-2">
        {reviews.map((review) => {
          const severity = highestSeverity(review);
          return (
            <button
              key={review._id}
              onClick={() => onSelectReview?.(review._id)}
              className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-colors text-left"
              style={{ backgroundColor: tokens.cardBg, border: `1px solid ${tokens.cardBorder}` }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = tokens.accent)}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = tokens.cardBorder)}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className="text-xs font-mono px-2 py-1 rounded shrink-0"
                  style={{ backgroundColor: tokens.editorSelectBg, color: tokens.textSecondary }}
                >
                  {review.language}
                </span>
                <span className="text-sm truncate" style={{ color: tokens.textSecondary }}>
                  {review.summary || 'Analysis in progress...'}
                </span>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {severity && <SeverityBadge severity={severity} />}
                <span className="text-sm font-semibold" style={{ color: tokens.textPrimary }}>
                  {review.overallScore}/100
                </span>
                <span className="flex items-center gap-1 text-xs" style={{ color: tokens.textMuted }}>
                  <Clock size={12} />
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
                <ChevronRight size={16} style={{ color: tokens.textMuted }} />
              </div>
            </button>
          );
        })}
      </div>

      {pages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-4">
          <button
            onClick={() => fetchReviews(page - 1)}
            disabled={page <= 1 || isLoading}
            className="px-3 py-1.5 text-sm rounded-md disabled:opacity-40 transition-colors"
            style={{ backgroundColor: tokens.editorSelectBg, color: tokens.textSecondary }}
          >
            Previous
          </button>
          <span className="text-sm" style={{ color: tokens.textMuted }}>
            Page {page} of {pages}
          </span>
          <button
            onClick={() => fetchReviews(page + 1)}
            disabled={page >= pages || isLoading}
            className="px-3 py-1.5 text-sm rounded-md disabled:opacity-40 transition-colors"
            style={{ backgroundColor: tokens.editorSelectBg, color: tokens.textSecondary }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}