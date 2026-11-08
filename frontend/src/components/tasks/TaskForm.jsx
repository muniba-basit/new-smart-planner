function TaskForm() {
  return (
    <div className="add-task-card">
      <form id="todo-form" autoComplete="off">
        <div className="form-row">
          <input type="text" id="todo-input" placeholder="What needs to be done?" aria-label="New task name" />
          <select id="todo-category" aria-label="Category">
            <option value="General">General</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Health">Health</option>
          </select>
          <select id="todo-priority" aria-label="Priority">
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="low">Low</option>
          </select>
          <button type="submit" id="add-btn">+ Add Task</button>
        </div>
      </form>
    </div>
  )
}

export default TaskForm
