/**
 * Register (Unslop pass - Light Theme)
 * Minimal registration card adhering to the modern minimal light palette:
 * - Primary CTA: rgb(57, 129, 246)
 * - Card: Crisp White with subtle shadow
 * - Subtle accents: rgb(220, 242, 255)
 * - Errors: rgb(241, 68, 68)
 */
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  HiOutlineUser,
  HiOutlineEnvelope,
  HiOutlineLockClosed,
  HiOutlinePaperAirplane,
  HiOutlineEye,
  HiOutlineEyeSlash,
} from 'react-icons/hi2';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';
import AuraBackground from '../components/AuraBackground';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setToast({ message: 'Please fill in all fields', type: 'error' });
      return;
    }

    if (password.length < 6) {
      setToast({ message: 'Password must be at least 6 characters long', type: 'error' });
      return;
    }

    setLoading(true);
    setToast(null);

    try {
      await register(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      const message =
        err.response?.data?.message || 'Registration failed. Please check details.';
      setToast({ message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-[#111827] flex items-center justify-center p-4 relative overflow-hidden">
      <AuraBackground fixed={true} />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Auth Card */}
      <div className="w-full max-w-sm unslop-card p-7 sm:p-8 border border-[rgba(17,24,39,0.08)] bg-white relative z-10 shadow-xl">
        <div className="mb-6 text-center">
          <div className="w-8 h-8 rounded-md bg-[#3981f6]/10 border border-[#3981f6]/25 flex items-center justify-center text-[#3981f6] mx-auto mb-3">
            <HiOutlinePaperAirplane size={16} className="-rotate-12" />
          </div>
          <h1 className="text-lg font-medium text-[#111827]">Create account</h1>
          <p className="text-xs text-[#6b7280] mt-1">Set up workspace admin credentials</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="name" className="block text-xs text-[#4b5563]">
              Name
            </label>
            <div className="relative">
              <HiOutlineUser
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]"
                size={15}
              />
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-[#f8fafc] border border-[rgba(17,24,39,0.12)] rounded-md pl-9 pr-3.5 py-2 text-xs text-[#111827] placeholder-[#94a3b8] focus:bg-white focus:outline-none focus:border-[#3981f6] focus:ring-1 focus:ring-[#3981f6]/30 transition-colors"
                placeholder="Full name"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-xs text-[#4b5563]">
              Email
            </label>
            <div className="relative">
              <HiOutlineEnvelope
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]"
                size={15}
              />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#f8fafc] border border-[rgba(17,24,39,0.12)] rounded-md pl-9 pr-3.5 py-2 text-xs text-[#111827] placeholder-[#94a3b8] focus:bg-white focus:outline-none focus:border-[#3981f6] focus:ring-1 focus:ring-[#3981f6]/30 transition-colors"
                placeholder="admin@example.com"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="block text-xs text-[#4b5563]">
              Password
            </label>
            <div className="relative">
              <HiOutlineLockClosed
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]"
                size={15}
              />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full bg-[#f8fafc] border border-[rgba(17,24,39,0.12)] rounded-md pl-9 pr-9 py-2 text-xs text-[#111827] placeholder-[#94a3b8] focus:bg-white focus:outline-none focus:border-[#3981f6] focus:ring-1 focus:ring-[#3981f6]/30 transition-colors"
                placeholder="••••••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#111827] p-0.5 cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <HiOutlineEyeSlash size={15} /> : <HiOutlineEye size={15} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 h-9 rounded-md bg-[#3981f6] hover:bg-[#2563eb] text-white font-medium text-xs transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2 shadow-sm"
          >
            {loading ? 'Creating...' : 'Create account'}
          </button>
        </form>

        <p className="text-center text-xs text-[#6b7280] mt-5">
          Already registered?{' '}
          <Link to="/login" className="text-[#3981f6] hover:text-[#1d4ed8] hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
