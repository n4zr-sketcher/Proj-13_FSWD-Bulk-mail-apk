/**
 * App — root component with routes, layout container, and ambient gradient background.
 */
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ComposeMail from './pages/ComposeMail';
import History from './pages/History';

/**
 * Layout — wraps authenticated views with the floating Navbar and ambient background glow.
 */
function Layout() {
  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 relative overflow-hidden flex flex-col">
      {/* Ambient background glow orbs */}
      <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none -z-10" />
      <div className="fixed top-[20%] right-[-10%] w-[450px] h-[450px] rounded-full bg-teal-500/10 blur-[130px] pointer-events-none -z-10" />
      <div className="fixed bottom-[-10%] left-[30%] w-[600px] h-[400px] rounded-full bg-emerald-600/5 blur-[150px] pointer-events-none -z-10" />

      {/* Subtle background grid pattern */}
      <div className="fixed inset-0 bg-grid-pattern opacity-15 pointer-events-none -z-10" />

      {/* Floating Navbar */}
      <Navbar />

      {/* Content wrapper with top spacing for floating navbar */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 pt-28 pb-16">
        <Outlet />
      </main>

      {/* Clean footer */}
      <footer className="w-full border-t border-white/5 py-6 text-center text-xs text-neutral-500">
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
