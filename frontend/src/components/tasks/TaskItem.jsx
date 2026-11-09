import Badge from '../common/Badge'

function TaskItem({ task, onToggle, onDelete }) {
  return (
    <li
      className={`todo-item${task.completed ? ' completed' : ''}`}
      data-priority={task.priority || 'medium'}
    >
      <button
        className={`task-check${task.completed ? ' done' : ''}`}
        aria-label={task.completed ? 'Mark pending' : 'Mark complete'}
        onClick={() => onToggle(task.id)}
      >
        {task.completed ? '✓' : ''}
      </button>

      <div className="task-body">
        <div className="task-text">{task.text}</div>
        <div className="task-meta">
          <Badge type="cat" value={task.category || 'General'} />
          <Badge type="priority" value={task.priority || 'medium'} />
        </div>
      </div>

      <div className="task-actions">
        <button
          className="task-btn del"
          aria-label="Delete task"
          onClick={() => onDelete(task.id)}
        >
          ✕
        </button>
      </div>
    </li>
  )
}

export default TaskItem