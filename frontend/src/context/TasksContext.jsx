import { createContext, useState } from 'react'

// Sample tasks for now — replaced with real data fetched from server.js
// once API wiring happens in a later session. More will be added to
// `value` then too (addTask, toggleTask, deleteTask).
const sampleTasks = [
  { id: 1, text: 'Finish Physics past paper', category: 'Work', priority: 'high', completed: false },
  { id: 2, text: 'Revise Chemistry Ch. 4', category: 'Personal', priority: 'medium', completed: false },
  { id: 3, text: 'Morning run', category: 'Health', priority: 'low', completed: true },
]

// Holds app-wide task state so Sidebar, StatsRow, TaskList (and later
// Calendar/Analytics/TimeBlock) can all read it without App.jsx having to
// pass it down as a prop to each one individually.
export const TasksContext = createContext(null)

export function TasksProvider({ children }) {
  const [tasks] = useState(sampleTasks)

  const value = { tasks }

  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>
}
