/**
 * Login (Unslop pass)
 * Minimalist, engineered sign in card.
 * - Quiet graphite palette, sentence case, no decorative glow or gradient wordmarks.
 * - Solid primary button and quiet password reveal.
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
    <div className="min-h-screen text-[#ededed] flex items-center justify-center p-4 relative overflow-hidden">
      <AuraBackground fixed={true} />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Auth Card */}
      <div className="w-full max-w-sm unslop-card p-7 sm:p-8 border border-[rgba(237,237,237,0.08)] bg-[#161618] relative z-10 shadow-2xl">
        <div className="mb-6 text-center">
          <div className="w-8 h-8 rounded-md bg-[#232325] border border-[rgba(237,237,237,0.1)] flex items-center justify-center text-[#10b981] mx-auto mb-3">
            <HiOutlinePaperAirplane size={16} />
          </div>
          <h1 className="text-lg font-medium text-[#ededed]">Sign in to BulkMail</h1>
          <p className="text-xs text-[#85858b] mt-1">Admin campaign management console</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-xs text-[#a1a1a6]">
              Email
            </label>
            <div className="relative">
              <HiOutlineEnvelope
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#85858b]"
                size={15}
              />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#1c1c1f] border border-[rgba(237,237,237,0.08)] rounded-md pl-9 pr-3.5 py-2 text-xs text-[#ededed] placeholder-[#85858b] focus:outline-none focus:border-[#4cc38a] transition-colors"
                placeholder="admin@example.com"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="block text-xs text-[#a1a1a6]">
              Password
            </label>
            <div className="relative">
              <HiOutlineLockClosed
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#85858b]"
                size={15}
              />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[#1c1c1f] border border-[rgba(237,237,237,0.08)] rounded-md pl-9 pr-9 py-2 text-xs text-[#ededed] placeholder-[#85858b] focus:outline-none focus:border-[#4cc38a] transition-colors"
                placeholder="••••••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#85858b] hover:text-[#ededed] p-0.5 cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <HiOutlineEyeSlash size={15} /> : <HiOutlineEye size={15} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 h-9 rounded-md bg-[#ededed] hover:bg-white text-[#100e0b] font-medium text-xs transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="text-center text-xs text-[#85858b] mt-5">
          Need an administrator account?{' '}
          <Link to="/register" className="text-[#ededed] hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
