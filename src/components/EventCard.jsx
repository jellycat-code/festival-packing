import './EventCard.css'

function formatDateRange(startStr, endStr) {
  const opts = { month: 'short', day: 'numeric' }
  const start = new Date(startStr + 'T00:00:00')
  const end = new Date(endStr + 'T00:00:00')
  const startFormatted = start.toLocaleDateString('en-US', opts)
  const endFormatted = end.toLocaleDateString('en-US', { ...opts, year: 'numeric' })
  return `${startFormatted} – ${endFormatted}`
}

function EventCard({ event, onOpen, onEdit, onDelete, isPast }) {
  function handleDelete() {
    if (!window.confirm(`Delete "${event.name}"? This cannot be undone.`)) return
    onDelete(event)
  }

  return (
    <div className={`event-card ${isPast ? 'event-card--past' : ''}`}>
      <button className="event-card__delete" onClick={handleDelete} aria-label="Delete event">✕</button>
      <div className="event-card__body">
        <h3 className="event-card__name">
          {event.name}
          {event.website && (
            <a href={event.website} target="_blank" rel="noopener noreferrer" className="event-site-link" aria-label="Event website">
              <svg width="12" height="12" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M5 1.5H2C1.72 1.5 1.5 1.72 1.5 2V11C1.5 11.28 1.72 11.5 2 11.5H11C11.28 11.5 11.5 11.28 11.5 11V8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                <path d="M7.5 1.5H11.5V5.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M11.5 1.5L6 7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
            </a>
          )}
        </h3>
        <p className="event-card__location">{event.location}</p>
        <p className="event-card__dates">
          {formatDateRange(event.startDate, event.endDate)}
        </p>
      </div>
      <div className="event-card__footer">
        <button className="btn btn--primary" onClick={() => onOpen(event)}>
          {isPast ? 'Review List' : 'Packing List'}
        </button>
        <button className="btn btn--secondary" onClick={() => onEdit(event)}>
          Edit Event
        </button>
      </div>
    </div>
  )
}

export default EventCard
