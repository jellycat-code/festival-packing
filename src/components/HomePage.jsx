import EventCard from './EventCard'
import './HomePage.css'

function HomePage({ events, onOpenEvent, onEditEvent, onDeleteEvent, onNewEvent, onDismissReminder }) {
  const byDate = (a, b) => new Date(a.startDate) - new Date(b.startDate)
  const activeEvents = events.filter(e => e.status === 'planning').sort(byDate)
  const pastEvents = events.filter(e => e.status === 'past').sort(byDate)
  const reminders = pastEvents.filter(e => e.needsPostMortem)

  const now = new Date()
  const weatherReminders = activeEvents.filter(e => {
    const daysUntil = Math.ceil((new Date(e.startDate + 'T00:00:00') - now) / (1000 * 60 * 60 * 24))
    return daysUntil >= 0 && daysUntil <= 5
  })
  function daysUntil(dateStr) {
    return Math.ceil((new Date(dateStr + 'T00:00:00') - now) / (1000 * 60 * 60 * 24))
  }

  return (
    <div className="home-page">
      {reminders.length > 0 && (
        <div className="reminder-banner">
          <div className="reminder-banner__text">
            <strong>Don't forget!</strong> Review your packing list from <strong>{reminders[0].name}</strong> — it'll make your next trip smarter.
          </div>
          <div className="reminder-banner__actions">
            <button className="btn btn--primary" onClick={() => onOpenEvent(reminders[0])}>Review Now</button>
            <button className="reminder-banner__dismiss" onClick={() => onDismissReminder(reminders[0].id)}>Dismiss</button>
          </div>
        </div>
      )}

      {weatherReminders.map(event => (
        <div key={event.id} className="reminder-banner reminder-banner--weather">
          <div className="reminder-banner__text">
            <strong>{event.name}</strong> starts {daysUntil(event.startDate) === 0 ? 'today' : `in ${daysUntil(event.startDate)} day${daysUntil(event.startDate) === 1 ? '' : 's'}`}! Check the forecast and update weather conditions if needed.
          </div>
          <div className="reminder-banner__actions">
            <button className="btn btn--secondary" onClick={() => onEditEvent(event)}>Update Weather</button>
          </div>
        </div>
      ))}

      <section className="events-section">
        <div className="section-header">
          <h2>Upcoming Events</h2>
          <button className="btn btn--primary" onClick={onNewEvent}>+ New Event</button>
        </div>
        {activeEvents.length === 0 ? (
          <p className="empty-state">No upcoming events. Hit "New Event" to get started!</p>
        ) : (
          <div className="event-grid">
            {activeEvents.map(event => (
              <EventCard key={event.id} event={event} onOpen={onOpenEvent} onEdit={onEditEvent} onDelete={onDeleteEvent} />
            ))}
          </div>
        )}
      </section>

      <section className="events-section">
        <h2>Past Events</h2>
        {pastEvents.length === 0 ? (
          <p className="empty-state">No past events yet.</p>
        ) : (
          <div className="event-grid">
            {pastEvents.map(event => (
              <EventCard key={event.id} event={event} onOpen={onOpenEvent} onEdit={onEditEvent} onDelete={onDeleteEvent} isPast />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default HomePage
