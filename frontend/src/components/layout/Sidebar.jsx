import { useTasks } from '../../hooks/useTasks'

function Sidebar() {
  const { tasks } = useTasks()

  const countFor = (cat) =>
    cat === 'all' ? tasks.length : tasks.filter((t) => t.category === cat).length

  return (
    <aside className="sidebar open" id="sidebar" aria-label="Navigation Sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <span className="logo-text">
            <span className="logo-task">Task</span>
            <span className="logo-nest">Nest</span>
          </span>
        </div>
        <button className="sidebar-close" id="sidebar-close" aria-label="Close sidebar">✕</button>
      </div>

      <nav className="sidebar-nav" aria-label="Main navigation">
        <button className="nav-item active" data-view="tasks" aria-current="page">
          <span className="nav-icon">☰</span><span>Tasks</span>
        </button>
        <button className="nav-item" data-view="calendar">
          <span className="nav-icon">◫</span><span>Calendar</span>
        </button>
        <button className="nav-item" data-view="analytics">
          <span className="nav-icon">◈</span><span>Analytics</span>
        </button>
        <button className="nav-item" data-view="timeblock">
          <span className="nav-icon">◷</span><span>Time Blocks</span>
        </button>
      </nav>

      <div className="sidebar-categories">
        <p className="sidebar-section-title">Categories</p>
        <button className="cat-filter active" data-cat="all">
          <span className="cat-dot" style={{ background: '#5B5FEF' }}></span>All Tasks
          <span className="cat-count">{countFor('all')}</span>
        </button>
        <button className="cat-filter" data-cat="General">
          <span className="cat-dot" style={{ background: '#22B8CF' }}></span>General
          <span className="cat-count">{countFor('General')}</span>
        </button>
        <button className="cat-filter" data-cat="Work">
          <span className="cat-dot" style={{ background: '#5B5FEF' }}></span>Work
          <span className="cat-count">{countFor('Work')}</span>
        </button>
        <button className="cat-filter" data-cat="Personal">
          <span className="cat-dot" style={{ background: '#FFB020' }}></span>Personal
          <span className="cat-count">{countFor('Personal')}</span>
        </button>
        <button className="cat-filter" data-cat="Health">
          <span className="cat-dot" style={{ background: '#2FBF71' }}></span>Health
          <span className="cat-count">{countFor('Health')}</span>
        </button>
      </div>

      <div className="sidebar-footer">
        <button id="theme-btn" className="theme-toggle-btn">
          <span id="theme-icon">🌙</span>
          <span id="theme-label">Dark Mode</span>
        </button>
        <div className="sidebar-streak">
          <span>🔥</span>
          <strong id="sidebar-streak-val">0</strong>
          <span>day streak</span>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
