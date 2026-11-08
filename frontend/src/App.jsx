import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { TasksProvider } from './context/TasksContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import PublicOnlyRoute from './components/auth/PublicOnlyRoute';
import LandingPage from './pages/LandingPage';
import AppLayout from './components/layout/AppLayout';
import LoginPage from './pages/LoginPage';
import TasksPage from './pages/TasksPage';
import CalendarPage from './pages/CalendarPage';
import AnalyticsPage from './pages/AnalyticsPage';
import TimeBlockPage from './pages/TimeBlockPage';
import AcademicsPage from './pages/academics/AcademicsPage';
import SubjectsPage from './pages/academics/SubjectsPage';
import PastPapersPage from './pages/academics/PastPapersPage';
import ExamScoresPage from './pages/academics/ExamScoresPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <AuthProvider>
      <TasksProvider>
        <Routes>
          {/* Public */}
          <Route element={<PublicOnlyRoute />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
          </Route>

          {/* Everything below requires login */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="tasks" element={<TasksPage />} />
              <Route path="calendar" element={<CalendarPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="timeblock" element={<TimeBlockPage />} />

              <Route path="academics" element={<AcademicsPage />}>
                <Route index element={<Navigate to="subjects" replace />} />
                <Route path="subjects" element={<SubjectsPage />} />
                <Route path="past-papers" element={<PastPapersPage />} />
                <Route path="exam-scores" element={<ExamScoresPage />} />
              </Route>
            </Route>
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </TasksProvider>
    </AuthProvider>
  );
}