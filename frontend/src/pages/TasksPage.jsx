// pages/TasksPage.jsx
import {useState} from 'react';
import StatsRow from '../components/tasks/StatsRow';
import TaskForm from '../components/tasks/TaskForm';
import FilterBar from '../components/tasks/FilterBar';
import TaskList from '../components/tasks/TaskList';

export default function TasksPage() {
  const [filter, setFilter] = useState('all');
  return (
    <>
      <StatsRow />
      <TaskForm />
      <FilterBar filter={filter} onFilterChange={setFilter}  />
      <TaskList filter={filter} />
    </>
  );
}