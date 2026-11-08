/**
 * App — root component with routes, layout container, and Aura: Violet Horizon background.
 */
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import AuraBackground from './components/AuraBackground';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ComposeMail from './pages/ComposeMail';
import History from './pages/History';

/**
 * Layout — wraps authenticated views with the floating Navbar and Violet Horizon Aura.
 */
function Layout() {
  return (
    <div className="min-h-screen text-slate-100 relative overflow-hidden flex flex-col">
      {/* Aura Gradient: "Violet Horizon" Atmospheric Background */}
      <AuraBackground fixed={true} />

      {/* Floating Navbar */}
      <Navbar />

      {/* Content wrapper with top spacing for floating navbar - sits above layers */}
      <main className="relative z-[1] flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 pt-28 pb-16">
        <Outlet />
      </main>

      {/* Clean footer */}
      <footer className="relative z-[1] w-full border-t border-white/5 py-6 text-center text-xs text-neutral-500">
        <p>BulkMail Platform • Powered by Brevo Transactional Engine</p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public authentication routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes wrapped in main layout */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="compose" element={<ComposeMail />} />
            <Route path="history" element={<History />} />
          </Route>

          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
