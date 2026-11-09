import { createContext, useState, useEffect } from 'react'
import * as tasksApi from '../api/tasks'

export const TasksContext = createContext(null)

export function TasksProvider({ children }) {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [categoryFilter, setCategoryFilter] = useState('all') // 'all' | 'General' | 'Work' | ...


  // Load tasks from the backend once on mount
  useEffect(() => {
    tasksApi
      .getTasks()
      .then(setTasks)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  // Each action: call the API first, then update local state if it succeeded
 async function addTask(data) {
  setError(null)
  try {
    const created = await tasksApi.createTask(data)
    setTasks((prev) => [created, ...prev]) // backend orders newest first
    return true
  } catch (err) {
    setError(err.message)
    return false
  }
}

  async function toggleTask(id) {
    setError(null)

    const task = tasks.find((t) => t.id === id)
    if (!task) return
    try {
      await tasksApi.updateTask(id, { completed: !task.completed })
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
      )
    } catch (err) {
      setError(err.message)
    }
  }

  async function deleteTask(id) {
    setError(null)
    try {
      await tasksApi.deleteTask(id)
      setTasks((prev) => prev.filter((t) => t.id !== id))
    } catch (err) {
      setError(err.message)
    }
  }

  const value = { tasks, loading, error, addTask, toggleTask, deleteTask, categoryFilter, setCategoryFilter }

  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>
}