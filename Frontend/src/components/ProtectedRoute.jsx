/**
 * ProtectedRoute — auth guard that wraps routes requiring authentication.
 * Redirects unauthenticated users to /login.
 * Shows nothing while auth state is loading.
 */
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  // Wait until auth state is resolved
  if (loading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
