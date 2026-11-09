import { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useTasks } from '../../hooks/useTasks'
import { useAuth } from '../../context/AuthContext'

const NAV_ITEMS = [
  { to: '/tasks', icon: '✓', label: 'Tasks' },
  { to: '/calendar', icon: '▦', label: 'Calendar' },
  { to: '/analytics', icon: '◔', label: 'Analytics' },
  { to: '/timeblock', icon: '◷', label: 'Time Blocking' },
  { to: '/academics', icon: '✎', label: 'Academics' },
]

const CATEGORIES = [
  { name: 'General', color: 'var(--blue)' },
  { name: 'Work', color: 'var(--mocha)' },
  { name: 'Personal', color: 'var(--gold)' },
  { name: 'Health', color: 'var(--green)' },
]

function Sidebar({ isOpen, onClose }) {
  const { tasks, categoryFilter, setCategoryFilter } = useTasks()
  const { logout, user } = useAuth()
  const navigate = useNavigate()

  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light')

  // Apply the theme to <html> so the [data-theme="dark"] rules in index.css take effect
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  function pickCategory(name) {
    setCategoryFilter(name)
    navigate('/tasks') // the category filter only affects the task list
    onClose()
  }

  return (
    <>
      <div className={`sidebar-overlay${isOpen ? ' show' : ''}`} onClick={onClose} />

      <aside className={`sidebar${isOpen ? ' open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <span className="logo-text">
              <span className="logo-task">Smart</span>
              <span className="logo-nest">Planner</span>
            </span>
          </div>
          <button className="sidebar-close" onClick={onClose} aria-label="Close menu">✕</button>
        </div>

        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-categories">
          <div className="sidebar-section-title">Categories</div>

          <button
            className={`cat-filter${categoryFilter === 'all' ? ' active' : ''}`}
            onClick={() => pickCategory('all')}
          >
            All
            <span className="cat-count">{tasks.length}</span>
          </button>

          {CATEGORIES.map((c) => (
            <button
              key={c.name}
              className={`cat-filter${categoryFilter === c.name ? ' active' : ''}`}
              onClick={() => pickCategory(c.name)}
            >
              <span className="cat-dot" style={{ background: c.color }} />
              {c.name}
              <span className="cat-count">
                {tasks.filter((t) => t.category === c.name).length}
              </span>
            </button>
          ))}
        </div>

        <div className="sidebar-footer">
          <button
            className="theme-toggle-btn"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? '☀ Light mode' : '☾ Dark mode'}
          </button>
          {user?.email && <span className="muted">{user.email}</span>}
          <button className="theme-toggle-btn" onClick={logout}>Log out</button>
        </div>
      </aside>
    </>
  )
}

export default Sidebar