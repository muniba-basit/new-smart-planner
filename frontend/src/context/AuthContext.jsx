import { createContext, useContext, useEffect, useState } from 'react';

/*
 * AuthContext — placeholder auth state for routing/gating purposes.
 *
 * server.js does not yet have /login or /register endpoints, so this
 * stores a fake "logged in" flag in localStorage rather than a real
 * token. Swap `login()` below for a real fetch('/auth/login', ...) call
 * once the backend has an auth route — everything else (ProtectedRoute,
 * the redirect-back-after-login flow) will keep working unchanged.
 */

const AuthContext = createContext(null);

const STORAGE_KEY = 'planner-auth-user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setLoading(false);
  }, []);

  // TODO: replace with a real API call once server.js has an auth route.
  async function login({ email }) {
    const fakeUser = { email };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fakeUser));
    setUser(fakeUser);
    return fakeUser;
  }

  function logout() {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }

  const value = {
    user,
    isAuthenticated: Boolean(user),
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
