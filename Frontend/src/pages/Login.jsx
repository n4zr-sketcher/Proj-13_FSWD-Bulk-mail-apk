/**
 * Login (Unslop pass)
 * Modern minimal sign in card adhering to the calibrated palette:
 * - Primary CTA: rgb(57, 129, 246)
 * - Text: rgb(245, 245, 245)
 * - Subtle accents: rgb(220, 242, 255)
 * - Errors: rgb(241, 68, 68)
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
    <div className="min-h-screen text-[#f5f5f5] flex items-center justify-center p-4 relative overflow-hidden">
      <AuraBackground fixed={true} />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Auth Card */}
      <div className="w-full max-w-sm unslop-card p-7 sm:p-8 border border-[rgba(245,245,245,0.08)] bg-[#121722] relative z-10 shadow-2xl">
        <div className="mb-6 text-center">
          <div className="w-8 h-8 rounded-md bg-[#3981f6]/10 border border-[#3981f6]/25 flex items-center justify-center text-[#3981f6] mx-auto mb-3">
            <HiOutlinePaperAirplane size={16} className="-rotate-12" />
          </div>
          <h1 className="text-lg font-medium text-[#f5f5f5]">Sign in to BulkMail</h1>
          <p className="text-xs text-[#64748b] mt-1">Admin campaign management console</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-xs text-[#9ca3af]">
              Email
            </label>
            <div className="relative">
              <HiOutlineEnvelope
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748b]"
                size={15}
              />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#0e121a] border border-[rgba(245,245,245,0.08)] rounded-md pl-9 pr-3.5 py-2 text-xs text-[#f5f5f5] placeholder-[#64748b] focus:outline-none focus:border-[#3981f6] focus:ring-1 focus:ring-[#3981f6]/30 transition-colors"
                placeholder="admin@example.com"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="block text-xs text-[#9ca3af]">
              Password
            </label>
            <div className="relative">
              <HiOutlineLockClosed
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748b]"
                size={15}
              />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[#0e121a] border border-[rgba(245,245,245,0.08)] rounded-md pl-9 pr-9 py-2 text-xs text-[#f5f5f5] placeholder-[#64748b] focus:outline-none focus:border-[#3981f6] focus:ring-1 focus:ring-[#3981f6]/30 transition-colors"
                placeholder="••••••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#64748b] hover:text-[#f5f5f5] p-0.5 cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <HiOutlineEyeSlash size={15} /> : <HiOutlineEye size={15} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 h-9 rounded-md bg-[#3981f6] hover:bg-[#2563eb] text-[#f5f5f5] font-medium text-xs transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2 shadow-sm"
          >
            {loading ? 'Authenticating...' : 'Sign in'}
          </button>
        </form>

        <p className="text-center text-xs text-[#64748b] mt-5">
          Need workspace credentials?{' '}
          <Link to="/register" className="text-[#3981f6] hover:text-[#dcf2ff] hover:underline">
            Register admin
          </Link>
        </p>
      </div>
    </div>
  );
}
