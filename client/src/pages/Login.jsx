import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!email.trim() || !password) {
      setError('Please enter both email and password');
      return;
    }
    setIsSubmitting(true);
    try {
      await login(email.trim(), password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        fontFamily: "'IBM Plex Sans', sans-serif",
        background:
          'radial-gradient(circle at 20% 20%, #1B4B4A 0%, transparent 45%), radial-gradient(circle at 80% 15%, #C97B4A 0%, transparent 40%), radial-gradient(circle at 50% 90%, #14343E 0%, transparent 50%), linear-gradient(160deg, #0B1B22 0%, #12262B 50%, #1B2A2E 100%)',
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-3xl p-8"
        style={{
          background: 'rgba(255,255,255,0.08)',
          backdropFilter: 'blur(18px)',
          WebkitBackdropFilter: 'blur(18px)',
          border: '1px solid rgba(255,255,255,0.25)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
        }}
      >
        <h2 className="text-2xl font-semibold text-center mb-1 text-white">
          Welcome back
        </h2>
        <p className="text-center text-sm mb-8" style={{ color: 'rgba(255,255,255,0.6)' }}>
          Log in to AI Code Reviewer
        </p>

        {error && (
          <p className="mb-5 text-sm text-center" style={{ color: '#FFB4A8' }}>
            {error}
          </p>
        )}

        <div className="mb-5">
          <label htmlFor="email" className="block text-sm mb-1.5" style={{ color: 'rgba(255,255,255,0.75)' }}>
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            disabled={isSubmitting}
            required
            className="w-full bg-transparent outline-none text-white pb-2"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.35)' }}
            onFocus={(e) => (e.target.style.borderBottom = '1px solid #FFFFFF')}
            onBlur={(e) => (e.target.style.borderBottom = '1px solid rgba(255,255,255,0.35)')}
          />
        </div>

        <div className="mb-2">
          <label htmlFor="password" className="block text-sm mb-1.5" style={{ color: 'rgba(255,255,255,0.75)' }}>
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              disabled={isSubmitting}
              required
              className="w-full bg-transparent outline-none text-white pb-2 pr-8"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.35)' }}
              onFocus={(e) => (e.target.style.borderBottom = '1px solid #FFFFFF')}
              onBlur={(e) => (e.target.style.borderBottom = '1px solid rgba(255,255,255,0.35)')}
            />
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              tabIndex={-1}
              className="absolute right-0 bottom-2"
              style={{ color: 'rgba(255,255,255,0.6)' }}
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
        </div>

        <div className="flex justify-end mt-3 mb-7">
          <Link to="#" className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 rounded-xl font-medium transition-opacity disabled:opacity-60"
          style={{ backgroundColor: '#FFFFFF', color: '#12262B' }}
        >
          {isSubmitting ? 'Logging in...' : 'Login'}
        </button>

        <p className="text-center text-sm mt-6" style={{ color: 'rgba(255,255,255,0.65)' }}>
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-white">Register</Link>
        </p>
      </form>
    </div>
  );
}