// pages/TasksPage.jsx
import StatsRow from '../components/tasks/StatsRow';
import TaskForm from '../components/tasks/TaskForm';
import FilterBar from '../components/tasks/FilterBar';
import TaskList from '../components/tasks/TaskList';

export default function TasksPage() {
  return (
    <>
      <StatsRow />
      <TaskForm />
      <FilterBar />
      <TaskList />
    </>
  );
}