import Badge from '../common/Badge'

// Note: no onClick handlers yet — the old script.js used
// onclick="toggleTask(id)" / onclick="deleteTask(id)" strings, which don't
// work in JSX. Those become real props (e.g. onToggle, onDelete) once state
// is wired up in a later session.
function TaskItem({ task }) {
  return (
    <li
      className={`todo-item${task.completed ? ' completed' : ''}`}
      data-id={task.id}
      data-priority={task.priority || 'medium'}
    >
      <span className="drag-handle" aria-hidden="true">⠿</span>
      <button
        className={`task-check${task.completed ? ' done' : ''}`}
        aria-label={task.completed ? 'Mark pending' : 'Mark complete'}
      >
        {task.completed ? '✓' : ''}
      </button>
      <div className="task-body">
        <div className="task-text">{task.text}</div>
        <div className="task-meta">
          <Badge type="cat" value={task.category} />
          <Badge type="priority" value={task.priority || 'medium'} />
        </div>
      </div>
      <div className="task-actions">
        <button className="task-btn del" aria-label="Delete task">✕</button>
      </div>
    </li>
  )
}

export default TaskItem
