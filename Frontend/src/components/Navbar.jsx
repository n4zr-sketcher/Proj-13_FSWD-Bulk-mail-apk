/**
 * Navbar (Unslop pass)
 * Quiet, engineered application header.
 * - Solid typography without gradient wordmarks or sparkle emojis.
 * - Active state is a calm surface step (#232325) with a hairline, not a gradient glow.
 * - Consistent 36px control heights and sentence case labels.
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
    <header className="sticky top-0 z-50 w-full border-b border-[rgba(237,237,237,0.08)] bg-[#100e0b]/90 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Brand Wordmark & Mark */}
        <div className="flex items-center gap-6">
          <NavLink to="/dashboard" className="flex items-center gap-2.5 text-[#ededed]">
            <div className="w-7 h-7 rounded-md bg-[#232325] border border-[rgba(237,237,237,0.1)] flex items-center justify-center text-[#10b981]">
              <HiOutlinePaperAirplane size={15} />
            </div>
            <span className="text-sm font-semibold tracking-tight text-[#ededed]">
              BulkMail
            </span>
          </NavLink>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-2 h-8 px-3 rounded-md text-[13px] font-normal transition-colors ${
                    isActive
                      ? 'bg-[#232325] text-[#ededed] border border-[rgba(237,237,237,0.08)]'
                      : 'text-[#a1a1a6] hover:text-[#ededed] hover:bg-[#19191b]'
                  }`
                }
              >
                <Icon size={14} className="text-[#85858b]" />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* User Status & Sign Out */}
        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-[#a1a1a6]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
            <span className="text-[#ededed] font-medium">{user?.name || 'Admin'}</span>
            <span className="text-[#85858b] truncate max-w-[160px]">({user?.email})</span>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-1.5 h-8 px-2.5 rounded-md text-xs text-[#a1a1a6] hover:text-[#ededed] hover:bg-[#19191b] border border-[rgba(237,237,237,0.08)] transition-colors cursor-pointer"
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
            className="p-1.5 text-[#a1a1a6] hover:text-[#ededed] rounded-md hover:bg-[#19191b] cursor-pointer"
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <HiOutlineXMark size={20} /> : <HiOutlineBars3 size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[rgba(237,237,237,0.08)] bg-[#141415] px-4 py-3 space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-2.5 h-9 px-3 rounded-md text-[13px] ${
                  isActive
                    ? 'bg-[#232325] text-[#ededed]'
                    : 'text-[#a1a1a6] hover:text-[#ededed]'
                }`
              }
            >
              <Icon size={15} />
              <span>{label}</span>
            </NavLink>
          ))}

          <div className="pt-2 border-t border-[rgba(237,237,237,0.08)] flex items-center justify-between">
            <span className="text-xs text-[#85858b]">{user?.email}</span>
            <button
              type="button"
              onClick={handleLogout}
              className="text-xs text-[#e5484d] hover:underline"
            >
              Sign out
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
