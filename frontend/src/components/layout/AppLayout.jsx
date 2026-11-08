import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AppLayout() {
  const { logout, user } = useAuth();


  return (
    <div className="app-shell">
      <aside id="sidebar" className="sidebar">
        <nav className="sidebar-nav">
          <NavLink to="/tasks" className="nav-item">Tasks</NavLink>
          <NavLink to="/calendar" className="nav-item">Calendar</NavLink>
          <NavLink to="/analytics" className="nav-item">Analytics</NavLink>
          <NavLink to="/timeblock" className="nav-item">Time Blocking</NavLink>
          <NavLink to="/academics" className="nav-item">Academics</NavLink>
        </nav>
        <div className="sidebar-footer">
          <span>{user?.email}</span>
          <button onClick={logout}>Log out</button>
        </div>
      </aside>

      <div className="app-wrapper">
        <header className="topbar" id="topbar">
          <button id="hamburger-btn" aria-label="Open menu">☰</button>
          <span id="topbar-date" />
        </header>

        <main className="view-outlet">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
