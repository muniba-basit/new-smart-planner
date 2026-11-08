import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Where to send the student after login: wherever they were headed
  // before ProtectedRoute intercepted them, or /tasks by default.
  const redirectTo = location.state?.from?.pathname || '/tasks';

  if (isAuthenticated) {
    // Already logged in and someone lands on /login anyway — skip it.
    navigate(redirectTo, { replace: true });
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    await login({ email, password });
    navigate(redirectTo, { replace: true });
  }

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1>Smart Planner</h1>
        <p className="auth-subtitle">Log in to continue</p>

        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Log In</button>
      </form>
    </div>
  );
}
