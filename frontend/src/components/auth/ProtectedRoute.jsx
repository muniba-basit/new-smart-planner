import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/*
 * Gate for every route that requires login.
 *
 * If the visitor isn't authenticated, they're bounced to /login and we
 * remember the page they were trying to reach in location.state.from —
 * LoginPage reads that back and sends them there after a successful login,
 * instead of always dropping them on /tasks.
 */
export default function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) return null; // or a small spinner once one exists

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
