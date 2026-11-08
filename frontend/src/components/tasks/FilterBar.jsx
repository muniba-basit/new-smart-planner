function FilterBar() {
  return (
    <div className="filter-bar">
      <div className="filter-group">
        <button className="filter-btn active" data-filter="all">All</button>
        <button className="filter-btn" data-filter="pending">Pending</button>
        <button className="filter-btn" data-filter="completed">Completed</button>
      </div>
      <select id="sort-select">
        <option value="newest">Newest First</option>
        <option value="oldest">Oldest First</option>
        <option value="priority">By Priority</option>
        <option value="category">By Category</option>
      </select>
    </div>
  )
}

export default FilterBar
