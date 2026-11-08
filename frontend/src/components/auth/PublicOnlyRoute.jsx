import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/*
 * Gate for routes that should only be visible to logged-out visitors
 * (the landing page and the login page). Mirror of ProtectedRoute.
 *
 * If the visitor is already authenticated, there's no reason to show them
 * the intro/login screens again — send them straight into the app.
 */
export default function PublicOnlyRoute() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null; // same placeholder as ProtectedRoute, swap both later

  if (isAuthenticated) {
    return <Navigate to="/tasks" replace />;
  }

  return <Outlet />;
}