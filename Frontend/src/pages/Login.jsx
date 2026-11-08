/**
 * Login — elegant modern authentication page with ambient glow,
 * leading input icons, password reveal toggle, and smooth loading state.
 */
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  HiOutlineEnvelope,
  HiOutlineLockClosed,
  HiOutlinePaperAirplane,
  HiOutlineEye,
  HiOutlineEyeSlash,
} from 'react-icons/hi2';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';
import AuraBackground from '../components/AuraBackground';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setToast({ message: 'Please enter both email and password', type: 'error' });
      return;
    }

    setLoading(true);
    setToast(null);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      const message =
        err.response?.data?.message || 'Invalid credentials. Please verify and try again.';
      setToast({ message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Aura Gradient: Violet Horizon Background */}
      <AuraBackground fixed={true} />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Centered Glassmorphic Authentication Card */}
      <div className="w-full max-w-md rounded-2xl glass-panel p-8 sm:p-10 border border-white/10 relative z-10 shadow-2xl shadow-emerald-950/40">
        {/* Brand Icon & Heading */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white mx-auto shadow-lg shadow-emerald-500/30 mb-4">
            <HiOutlinePaperAirplane className="text-2xl rotate-[-15deg]" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">
            Welcome to{' '}
            <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
              BULKMAIL
            </span>
          </h1>
          <p className="text-xs text-neutral-400 mt-1.5">
            Sign in to access your dashboard and dispatch campaigns.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5"
            >
              Email Address
            </label>
            <div className="relative">
              <HiOutlineEnvelope
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
                size={16}
              />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium"
                placeholder="admin@example.com"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5"
            >
              Password
            </label>
            <div className="relative">
              <HiOutlineLockClosed
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
                size={16}
              />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium"
                placeholder="••••••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white p-1"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <HiOutlineEyeSlash size={16} /> : <HiOutlineEye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Signing In...</span>
              </>
            ) : (
              'Sign In to Console'
            )}
          </button>
        </form>

        {/* Footer switch link */}
        <p className="text-center text-xs text-neutral-400 mt-6">
          Don&apos;t have an admin account?{' '}
          <Link
            to="/register"
            className="font-semibold text-emerald-400 hover:text-emerald-300 transition-colors underline"
          >
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
}
