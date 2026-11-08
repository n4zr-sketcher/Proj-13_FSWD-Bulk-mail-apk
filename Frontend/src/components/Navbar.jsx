/**
 * Floating Navbar (Navbar 12 style) — floating glassmorphic header that lifts on scroll.
 * Features:
 * - Dynamic scroll detection: expands/lifts and increases glassmorphism on scroll
 * - Active pill indicator with emerald glow
 * - Brevo API status indicator
 * - User avatar initials and sleek logout button
 * - Fully responsive mobile drawer
 */
import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  HiOutlinePaperAirplane,
  HiOutlineSquares2X2,
  HiOutlineClock,
  HiOutlineArrowRightOnRectangle,
  HiOutlineBars3,
  HiOutlineXMark,
  HiSparkles,
} from 'react-icons/hi2';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: HiOutlineSquares2X2 },
  { to: '/compose', label: 'Compose', icon: HiOutlinePaperAirplane },
  { to: '/history', label: 'History', icon: HiOutlineClock },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Scroll listener to detect when user scrolls down
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // User initials for avatar
  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'AD';

  return (
    <header className="fixed top-3 inset-x-0 z-50 flex justify-center px-4 pointer-events-none transition-all duration-300">
      <nav
        className={`pointer-events-auto w-full max-w-5xl rounded-2xl border transition-all duration-300 ${
          scrolled
            ? 'bg-[#0f172a]/85 backdrop-blur-xl border-emerald-500/25 shadow-2xl shadow-emerald-950/50 py-2.5 px-4'
            : 'bg-[#0f172a]/65 backdrop-blur-md border-white/10 shadow-lg shadow-black/30 py-3 px-5'
        }`}
      >
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <NavLink to="/dashboard" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/30 group-hover:scale-105 transition-transform duration-200">
              <HiOutlinePaperAirplane className="text-lg rotate-[-15deg] group-hover:rotate-0 transition-transform duration-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold tracking-wider bg-gradient-to-r from-white via-slate-100 to-emerald-400 bg-clip-text text-transparent">
                  BULKMAIL
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Brevo
                </span>
              </div>
            </div>
          </NavLink>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center gap-1.5 bg-black/30 p-1 rounded-xl border border-white/5">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 border border-emerald-500/30 shadow-sm shadow-emerald-500/10'
                      : 'text-neutral-400 hover:text-white hover:bg-white/5 border border-transparent'
                  }`
                }
              >
                <Icon className="text-sm" />
                <span>{label}</span>
              </NavLink>
            ))}
          </div>

          {/* User profile & Actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* User Avatar Badge */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-white/10">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-xs font-bold text-white shadow-sm">
                {initials}
              </div>
              <div className="text-left hidden lg:block">
                <p className="text-xs font-semibold text-white leading-tight">
                  {user?.name || 'Administrator'}
                </p>
                <p className="text-[10px] text-neutral-400 truncate max-w-[120px]">
                  {user?.email || 'admin@app.com'}
                </p>
              </div>
            </div>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-neutral-400 hover:text-red-400 bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/30 px-3 py-1.5 rounded-lg transition-all duration-200 cursor-pointer"
              title="Sign Out"
            >
              <HiOutlineArrowRightOnRectangle className="text-sm" />
              <span>Logout</span>
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-xs font-bold">
              {initials}
            </div>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="text-neutral-200 hover:text-white p-2 rounded-lg bg-white/5 border border-white/10 cursor-pointer"
              aria-label="Toggle Navigation"
            >
              {mobileOpen ? <HiOutlineXMark size={20} /> : <HiOutlineBars3 size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileOpen && (
          <div className="md:hidden pt-4 pb-2 border-t border-white/10 mt-3 space-y-2">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors ${
                    isActive
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'text-neutral-300 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                <Icon size={16} />
                <span>{label}</span>
              </NavLink>
            ))}

            <div className="pt-2 border-t border-white/5 flex items-center justify-between">
              <span className="text-xs text-neutral-400 truncate">
                {user?.email || 'Logged in'}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-xs font-semibold uppercase text-red-400 hover:text-red-300 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 cursor-pointer"
              >
                <HiOutlineArrowRightOnRectangle size={14} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
