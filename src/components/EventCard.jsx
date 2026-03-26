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
      <div className="event-card__body">
        <h3 className="event-card__name">{event.name}</h3>
        <p className="event-card__location">{event.location}</p>
        <p className="event-card__dates">
          {formatDateRange(event.startDate, event.endDate)}
        </p>
      </div>
      <div className="event-card__footer">
        <button className="btn btn--primary" onClick={() => onOpen(event)}>
          {isPast ? 'View List' : 'Packing List'}
        </button>
        <button className="btn btn--secondary" onClick={() => onEdit(event)}>
          Edit
        </button>
        <button className="btn btn--danger" onClick={handleDelete}>
          Delete
        </button>
      </div>
    </div>
  )
}

export default EventCard
