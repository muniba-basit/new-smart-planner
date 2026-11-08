import { useTasks } from '../../hooks/useTasks'

function StatsRow() {
  const { tasks } = useTasks()

  const total = tasks.length
  const done = tasks.filter((t) => t.completed).length
  const pending = total - done
  const rate = total === 0 ? 0 : Math.round((done / total) * 100)

  return (
    <div className="stats-row">
      <div className="stat-pill"><span>{total}</span> Total</div>
      <div className="stat-pill green"><span>{done}</span> Done</div>
      <div className="stat-pill blue"><span>{pending}</span> Pending</div>
      <div className="stat-pill gold"><span>{rate}%</span> Rate</div>
    </div>
  )
}

export default StatsRow
