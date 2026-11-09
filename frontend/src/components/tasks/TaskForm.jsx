import { useState } from 'react'
import { useTasks } from '../../hooks/useTasks'

function TaskForm() {
  const { addTask } = useTasks()
  const [text, setText] = useState('')
  const [category, setCategory] = useState('General')
  const [priority, setPriority] = useState('medium')

  async function handleSubmit(e) {
    e.preventDefault() // stop the browser reloading the page
    if (!text.trim()) return
    const ok = await addTask({ text: text.trim(), category, priority })
    if (ok) setText('') // keep the text if the request failed
  }

  return (
    <div className="add-task-card">
      <form id="todo-form" autoComplete="off" onSubmit={handleSubmit}>
        <div className="form-row">
          <input
            type="text"
            id="todo-input"
            placeholder="What needs to be done?"
            aria-label="New task name"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <select
            id="todo-category"
            aria-label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="General">General</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Health">Health</option>
          </select>
          <select
            id="todo-priority"
            aria-label="Priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
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