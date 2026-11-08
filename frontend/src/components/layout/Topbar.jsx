function Topbar() {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <header className="topbar">
      <button className="hamburger" id="hamburger-btn" aria-label="Toggle sidebar">
        <span></span><span></span><span></span>
      </button>
      <div className="topbar-center">
        <h1>The Smart Planner</h1>
        <span>{today}</span>
      </div>
    </header>
  )
}

export default Topbar
