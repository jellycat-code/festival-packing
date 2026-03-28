import { useState, useMemo } from 'react'
import Modal from './Modal'
import ExternalLinkIcon from './ExternalLinkIcon'
import { formatDateRange } from '../utils/format'
import { listKey } from '../utils/storageKeys'
import './EventCard.css'

function getPackingProgress(eventId) {
  try {
    const saved = localStorage.getItem(listKey(eventId))
    if (!saved) return null
    const items = JSON.parse(saved)
    const countable = items.filter(i => !i.rejected && !i.parentId)
    if (countable.length === 0) return null
    const packed = countable.filter(i => i.packed).length
    return { packed, total: countable.length }
  } catch {
    return null
  }
}

function EventCard({ event, onOpen, onEdit, onDelete, isPast }) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const progress = useMemo(() => getPackingProgress(event.id), [event.id])

  return (
    <div className={`event-card ${isPast ? 'event-card--past' : ''}`}>
      <button className="event-card__delete" onClick={() => setShowDeleteConfirm(true)} aria-label="Delete event">✕</button>
      <div className="event-card__body">
        <h3 className="event-card__name">
          {event.name}
          {event.website && (
            <a href={event.website} target="_blank" rel="noopener noreferrer" className="event-site-link" aria-label="Event website">
              <ExternalLinkIcon size={12} />
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

      {progress !== null && (
        <div className="event-card__progress-track">
          <div
            className="event-card__progress-fill"
            style={{ width: `${(progress.packed / progress.total) * 100}%` }}
          />
        </div>
      )}

      <Modal isOpen={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)} labelId="delete-confirm-title">
        <h3 id="delete-confirm-title">Delete "{event.name}"?</h3>
        <p>This will permanently remove the event and its packing list. This cannot be undone.</p>
        <div className="modal-actions">
          <button className="btn btn--danger" onClick={() => { setShowDeleteConfirm(false); onDelete(event) }}>Delete</button>
          <button className="btn btn--secondary" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
        </div>
      </Modal>
    </div>
  )
}

export default EventCard
