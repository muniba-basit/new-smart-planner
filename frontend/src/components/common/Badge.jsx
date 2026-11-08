// type: 'cat' (category) or 'priority' — matches the badge-cat / badge-priority
// CSS classes already defined in style.css, so no new styling is needed.
function Badge({ type, value }) {
  const className = type === 'cat' ? `badge badge-cat ${value}` : `badge badge-priority ${value}`
  return <span className={className}>{value}</span>
}

export default Badge
