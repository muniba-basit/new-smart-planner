import { useTasks } from '../../hooks/useTasks'
import TaskItem from './TaskItem'
import EmptyState from './EmptyState'

// Now reads tasks from context instead of receiving them as a prop, and
// decides for itself whether to show the empty state — App.jsx no longer
// needs to know about that logic at all.
function TaskList() {
  const { tasks } = useTasks()

  if (tasks.length === 0) {
    return <EmptyState />
  }

  return (
    <ul id="todo-list" aria-live="polite">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </ul>
  )
}

export default TaskList
