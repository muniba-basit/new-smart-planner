import { useContext } from 'react'
import { TasksContext } from '../context/TasksContext'

// Convenience wrapper so components call useTasks() instead of
// useContext(TasksContext) directly, and get a clear error message if
// someone forgets to wrap the app in <TasksProvider>.
export function useTasks() {
  const context = useContext(TasksContext)
  if (!context) {
    throw new Error('useTasks must be used inside a <TasksProvider>')
  }
  return context
}
