/**
 * App (Unslop pass)
 * Root routing layout with quiet header, structured spacing, and Aura background.
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

function Layout() {
  return (
    <div className="min-h-screen text-[#111827] relative overflow-hidden flex flex-col">
      {/* Subtle Aura atmosphere */}
      <AuraBackground fixed={true} />

      {/* Quiet top navigation */}
      <Navbar />

      {/* Main content column on 4px spacing grid */}
      <main className="relative z-[1] flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <Outlet />
      </main>

      {/* Minimalist footer */}
      <footer className="relative z-[1] w-full border-t border-[rgba(17,24,39,0.08)] py-5 text-center text-xs text-[#6b7280]">
        <p>BulkMail &bull; Brevo Transactional Engine</p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes */}
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

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
