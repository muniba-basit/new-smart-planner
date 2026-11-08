// pages/LandingPage.jsx
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="landing-page">
      <div className="landing-content">
        <div className="landing-logo">
          <svg width="48" height="48" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <rect width="60" height="60" rx="12" fill="var(--bg2)" />
            <path d="M 12 42 Q 30 56 48 42" stroke="var(--mocha)" strokeWidth="2.8" strokeLinecap="round" />
            <path d="M 16 35 Q 30 48 44 35" stroke="var(--mocha-lt)" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
          <span className="landing-logo-text">
            <span className="logo-task">Task</span><span className="logo-nest">Nest</span>
          </span>
        </div>

        <h1 className="landing-title">Plan smarter. Study sharper.</h1>
        <p className="landing-subtitle">
          Smart Planner brings your daily tasks, calendar, time blocking and
          academic tracking into one clean, student-friendly workspace —
          built for O/A Level students who want to stay on top of everything
          without the clutter.
        </p>

        <ul className="landing-features">
          <li>📝 Smart task management with priorities &amp; categories</li>
          <li>🗓️ Calendar &amp; time-blocking views</li>
          <li>📊 Analytics on your streaks and completion rate</li>
          <li>🎓 Academics: subjects, past papers &amp; exam scores</li>
        </ul>

        <Link to="/login" className="landing-cta">Sign In</Link>
      </div>
    </div>
  );
}