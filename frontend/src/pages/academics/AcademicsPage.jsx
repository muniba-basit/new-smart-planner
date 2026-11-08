import { NavLink, Outlet } from 'react-router-dom';

/*
 * Academics has its own sub-navigation (Subjects / Past Papers / Exam
 * Scores), so it's a nested route: /academics/*. This is the new area
 * mentioned in planner-context.md — not built yet, just routed to.
 */
export default function AcademicsPage() {
  return (
    <section>
      <h2>Academics</h2>
      <nav className="academics-subnav">
        <NavLink to="/academics/subjects">Subjects</NavLink>
        <NavLink to="/academics/past-papers">Past Paper Log</NavLink>
        <NavLink to="/academics/exam-scores">Exam Score Log</NavLink>
      </nav>
      <Outlet />
    </section>
  );
}
