/**
 * Login — centered admin login page.
 * Box-shaped inputs and button, minimal layout.
 * Redirects to /dashboard on success, shows error toast on failure.
 */
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setToast(null);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      const message =
        err.response?.data?.message || 'Login failed. Please try again.';
      setToast({ message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="w-full max-w-sm">
        {/* Branding */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-black tracking-widest uppercase">
            BULKMAIL
          </h1>
          <p className="text-neutral-500 text-sm mt-2">Admin Login</p>
        </div>

        {/* Login form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-xs uppercase tracking-wide text-neutral-500 mb-1.5">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-neutral-200 rounded-sm px-4 py-3 text-sm text-black placeholder-neutral-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-xs uppercase tracking-wide text-neutral-500 mb-1.5">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-neutral-200 rounded-sm px-4 py-3 text-sm text-black placeholder-neutral-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white text-sm uppercase tracking-wide font-medium px-6 py-3 rounded-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer mt-2"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Register link */}
        <p className="text-center text-sm text-neutral-500 mt-8">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="text-black underline hover:text-emerald-500 transition-colors">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
