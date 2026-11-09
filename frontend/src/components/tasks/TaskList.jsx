import { useTasks } from '../../hooks/useTasks'
import TaskItem from './TaskItem'
import EmptyState from './EmptyState'

function TaskList({ filter }) {
  const { tasks, loading, error, toggleTask, deleteTask, categoryFilter } = useTasks()

  if (loading) return <p className="muted">Loading tasks...</p>

  // Apply the category filter (from the sidebar), then the status filter (from FilterBar)
  const visibleTasks = tasks
    .filter((t) => categoryFilter === 'all' || t.category === categoryFilter)
    .filter((t) =>
      filter === 'pending' ? !t.completed :
      filter === 'completed' ? t.completed :
      true
    )

  return (
    <>
      {error && <p className="muted" style={{ color: 'var(--danger)' }}>{error}</p>}

      {visibleTasks.length === 0 ? (
        <EmptyState />
      ) : (
        <ul id="todo-list" aria-live="polite">
          {visibleTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={toggleTask}
              onDelete={deleteTask}
            />
          ))}
        </ul>
      )}
    </>
  )
}

export default TaskList