/**
 * Navbar (Unslop pass - Light Theme)
 * Modern minimal application header using the calibrated palette:
 * - Brand Accent: rgb(57, 129, 246) [#3981f6]
 * - Base Surface: rgb(245, 245, 245) & crisp white
 * - Subtle Ice Tint: rgb(220, 242, 255) [#dcf2ff]
 * - Alert / Destructive: rgb(241, 68, 68) [#f14444]
 */
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  HiOutlineSquares2X2,
  HiOutlinePaperAirplane,
  HiOutlineClock,
  HiOutlineArrowRightOnRectangle,
  HiOutlineBars3,
  HiOutlineXMark,
} from 'react-icons/hi2';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: HiOutlineSquares2X2 },
  { to: '/compose', label: 'Compose', icon: HiOutlinePaperAirplane },
  { to: '/history', label: 'History', icon: HiOutlineClock },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[rgba(17,24,39,0.08)] bg-white/85 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Brand Wordmark & Mark */}
        <div className="flex items-center gap-6">
          <NavLink to="/dashboard" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-[#3981f6]/10 border border-[#3981f6]/30 flex items-center justify-center text-[#3981f6]">
              <HiOutlinePaperAirplane size={14} className="-rotate-12" />
            </div>
            <span className="text-sm font-semibold tracking-tight text-[#111827]">
              BulkMail
            </span>
          </NavLink>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-2 h-8 px-3 rounded-md text-[13px] transition-colors ${
                    isActive
                      ? 'bg-[#3981f6]/10 text-[#1d4ed8] border border-[#3981f6]/25 font-medium'
                      : 'text-[#4b5563] hover:text-[#111827] hover:bg-[#f1f5f9]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon size={14} className={isActive ? 'text-[#3981f6]' : 'text-[#6b7280]'} />
                    <span>{label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* User Status & Sign Out */}
        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-[#4b5563]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3981f6]" />
            <span className="text-[#111827] font-medium">{user?.name || 'Admin'}</span>
            <span className="text-[#6b7280] truncate max-w-[160px]">({user?.email})</span>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-1.5 h-8 px-2.5 rounded-md text-xs text-[#4b5563] hover:text-[#f14444] hover:bg-[#f14444]/10 hover:border-[#f14444]/25 border border-[rgba(17,24,39,0.08)] bg-white transition-colors cursor-pointer"
            title="Sign out"
          >
            <HiOutlineArrowRightOnRectangle size={14} />
            <span>Sign out</span>
          </button>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden items-center gap-2">
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-1.5 text-[#4b5563] hover:text-[#111827] rounded-md hover:bg-[#f1f5f9] cursor-pointer"
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <HiOutlineXMark size={20} /> : <HiOutlineBars3 size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[rgba(17,24,39,0.08)] bg-white px-4 py-3 space-y-1 shadow-md">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-2.5 h-9 px-3 rounded-md text-xs font-normal transition-colors ${
                  isActive
                    ? 'bg-[#3981f6]/10 text-[#1d4ed8] border border-[#3981f6]/25 font-medium'
                    : 'text-[#4b5563] hover:text-[#111827] hover:bg-[#f1f5f9]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={15} className={isActive ? 'text-[#3981f6]' : 'text-[#6b7280]'} />
                  <span>{label}</span>
                </>
              )}
            </NavLink>
          ))}

          <div className="pt-3 border-t border-[rgba(17,24,39,0.08)] flex items-center justify-between text-xs text-[#4b5563]">
            <span className="truncate">{user?.email}</span>
            <button
              type="button"
              onClick={handleLogout}
              className="text-[#f14444] hover:underline"
            >
              Sign out
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
