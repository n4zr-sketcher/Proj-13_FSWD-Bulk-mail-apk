/**
 * Navbar — top navigation bar for the application.
 * Desktop: black bar with app name on left, nav links and logout on right.
 * Mobile: hamburger icon that toggles a vertical slide-down menu.
 * Uses NavLink for active state styling (emerald-400 + bottom border).
 */
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { HiOutlineMenu, HiOutlineX } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';

const navLinks = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/compose', label: 'Compose' },
  { to: '/history', label: 'History' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Shared class builder for NavLink active/inactive states
  const linkClass = ({ isActive }) =>
    `text-sm uppercase tracking-wide transition-colors px-1 py-2 border-b-2 ${
      isActive
        ? 'text-emerald-400 border-emerald-400'
        : 'text-white border-transparent hover:text-emerald-400'
    }`;

  return (
    <nav className="bg-black w-full">
      <div className="max-w-5xl mx-auto px-6 flex items-center justify-between h-14">
        {/* App name */}
        <NavLink to="/dashboard" className="text-white text-base font-bold tracking-widest uppercase">
          BULKMAIL
        </NavLink>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(({ to, label }) => (
            <NavLink key={to} to={to} className={linkClass}>
              {label}
            </NavLink>
          ))}

          <button
            onClick={handleLogout}
            className="text-sm text-white uppercase tracking-wide border border-white px-4 py-1.5 hover:bg-white hover:text-black transition-colors cursor-pointer"
          >
            Logout
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-white p-1 cursor-pointer"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <HiOutlineX size={22} /> : <HiOutlineMenu size={22} />}
        </button>
      </div>

      {/* Mobile menu — slides open vertically */}
      {mobileOpen && (
        <div className="md:hidden bg-black border-t border-neutral-800 px-6 pb-4 space-y-3">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `block text-sm uppercase tracking-wide py-2 transition-colors ${
                  isActive ? 'text-emerald-400' : 'text-white hover:text-emerald-400'
                }`
              }
            >
              {label}
            </NavLink>
          ))}

          <button
            onClick={handleLogout}
            className="text-sm text-white uppercase tracking-wide border border-white px-4 py-1.5 hover:bg-white hover:text-black transition-colors w-full mt-2 cursor-pointer"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
