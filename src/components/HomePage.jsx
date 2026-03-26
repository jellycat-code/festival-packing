import EventCard from './EventCard'
import './HomePage.css'

function HomePage({ events, onOpenEvent }) {
  const byDate = (a, b) => new Date(a.startDate) - new Date(b.startDate)
  const activeEvents = events.filter(e => e.status === 'planning').sort(byDate)
  const pastEvents = events.filter(e => e.status === 'past').sort(byDate)

  return (
    <div className="home-page">
      <section className="events-section">
        <h2>Upcoming Events</h2>
        {activeEvents.length === 0 ? (
          <p className="empty-state">No upcoming events. Hit "New Event" to get started!</p>
        ) : (
          <div className="event-grid">
            {activeEvents.map(event => (
              <EventCard key={event.id} event={event} onOpen={onOpenEvent} />
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
              <EventCard key={event.id} event={event} onOpen={onOpenEvent} isPast />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default HomePage
