import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(name, email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
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
      <div
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
          Create an account
        </h2>
        <p className="text-center text-sm mb-8" style={{ color: 'rgba(255,255,255,0.6)' }}>
          Start getting feedback on your code
        </p>

        {error && (
          <p className="mb-5 text-sm text-center" style={{ color: '#FFB4A8' }}>
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="block text-sm mb-1.5" style={{ color: 'rgba(255,255,255,0.75)' }}>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-transparent outline-none text-white pb-2"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.35)' }}
              onFocus={(e) => (e.target.style.borderBottom = '1px solid #FFFFFF')}
              onBlur={(e) => (e.target.style.borderBottom = '1px solid rgba(255,255,255,0.35)')}
            />
          </div>
          <div className="mb-5">
            <label className="block text-sm mb-1.5" style={{ color: 'rgba(255,255,255,0.75)' }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-transparent outline-none text-white pb-2"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.35)' }}
              onFocus={(e) => (e.target.style.borderBottom = '1px solid #FFFFFF')}
              onBlur={(e) => (e.target.style.borderBottom = '1px solid rgba(255,255,255,0.35)')}
            />
          </div>
          <div className="mb-8">
            <label className="block text-sm mb-1.5" style={{ color: 'rgba(255,255,255,0.75)' }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-transparent outline-none text-white pb-2"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.35)' }}
              onFocus={(e) => (e.target.style.borderBottom = '1px solid #FFFFFF')}
              onBlur={(e) => (e.target.style.borderBottom = '1px solid rgba(255,255,255,0.35)')}
            />
            <p className="text-xs mt-1.5" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Use at least 8 characters
            </p>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl font-medium"
            style={{ backgroundColor: '#FFFFFF', color: '#12262B' }}
          >
            Create account
          </button>
        </form>

        <p className="text-center text-sm mt-6" style={{ color: 'rgba(255,255,255,0.65)' }}>
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-white">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;