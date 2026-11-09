const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

// Database row -> the shape our components use
function fromServer(row) {
  return {
    id: row.id,
    text: row.title,
    category: row.category,
    priority: row.priority,
    completed: row.status === 'completed',
  }
}

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  const body = await res.json()
  if (!res.ok || !body.success) {
    throw new Error(body.message || 'Request failed')
  }
  return body
}

export async function getTasks() {
  const body = await request('/tasks')
  return body.data.map(fromServer)
}

export async function createTask({ text, category, priority }) {
  const body = await request('/tasks', {
    method: 'POST',
    body: JSON.stringify({ title: text, category, priority }),
  })
  // The POST response doesn't include server defaults, so build the task ourselves
  return { id: body.data.id, text, category, priority, completed: false }
}

export async function updateTask(id, { text, category, priority, completed }) {
  const payload = {}
  if (text !== undefined) payload.title = text
  if (category !== undefined) payload.category = category
  if (priority !== undefined) payload.priority = priority
  if (completed !== undefined) payload.status = completed ? 'completed' : 'pending'

  await request(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(payload) })
}

export async function deleteTask(id) {
  await request(`/tasks/${id}`, { method: 'DELETE' })
}