import { useState, useEffect } from 'react'
import HomePage from './components/HomePage'
import CreateEventPage from './components/CreateEventPage'
import PackingListPage from './components/PackingListPage'
import LNTPage from './components/LNTPage'
import AboutPage from './components/AboutPage'
import { EVENTS_KEY, listKey, notesKey } from './utils/storageKeys'
import './App.css'

// Decorative hexagon accents in the header
function hexPoints(cx, cy, r) {
  return Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i - Math.PI / 6
    return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`
  }).join(' ')
}

const HEADER_HEXES = [
  { cx: 1390, cy: 32, r: 52 },  // large, right edge
  { cx: 1262, cy: -8, r: 40 },  // medium-large, clips top
  { cx: 1325, cy: 76, r: 36 },  // medium, clips bottom
  { cx: 1148, cy: 16, r: 22 },  // small, upper
  { cx: 1195, cy: 54, r: 15 },  // tiny, lower
  { cx: 1070, cy: -5, r: 32 },  // medium, clips top
  { cx: 1110, cy: 68, r: 20 },  // small, clips bottom
  { cx: 905,  cy: -6, r: 28 },  // medium, center area, clips top
  { cx: 958,  cy: 50, r: 16 },  // small, lower center
]

const BG_HEXES = [
  { cx: 160, cy: 210, r: 130 },
  { cx: 70,  cy: 110, r: 85 },
  { cx: 230, cy: 140, r: 65 },
  { cx: 40,  cy: 255, r: 48 },
  { cx: 175, cy: 75,  r: 38 },
]

function App() {
  const [events, setEvents] = useState(() => {
    try {
      const saved = localStorage.getItem(EVENTS_KEY)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })
  const [currentPage, setCurrentPage] = useState('home')
  const [editingEvent, setEditingEvent] = useState(null)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [feedbackOnOpen, setFeedbackOnOpen] = useState(false)

  useEffect(() => {
    localStorage.setItem(EVENTS_KEY, JSON.stringify(events))
  }, [events])

  // Auto-expire planning events whose end date has passed
  useEffect(() => {
    const now = new Date()
    const hasExpired = events.some(
      e => e.status === 'planning' && new Date(e.endDate + 'T23:59:59') < now
    )
    if (hasExpired) {
      setEvents(prev => prev.map(e =>
        e.status === 'planning' && new Date(e.endDate + 'T23:59:59') < now
          ? { ...e, status: 'past', needsPostMortem: true }
          : e
      ))
    }
  }, [])

  function handleAddEvent(newEvent) {
    setEvents(prev => [...prev, newEvent])
    setCurrentPage('home')
  }

  function handleEditEvent(event) {
    setEditingEvent(event)
    setCurrentPage('edit')
  }

  function handleSaveEvent(updatedEvent) {
    setEvents(prev => prev.map(e => e.id === updatedEvent.id ? updatedEvent : e))
    setEditingEvent(null)
    setCurrentPage('home')
  }

  function handleDismissReminder(eventId) {
    setEvents(prev => prev.map(e => e.id === eventId ? { ...e, needsPostMortem: false } : e))
  }

  function handleDeleteEvent(event) {
    setEvents(prev => prev.filter(e => e.id !== event.id))
    localStorage.removeItem(listKey(event.id))
    localStorage.removeItem(notesKey(event.id))
  }

  function handleOpenEvent(event) {
    if (event.needsPostMortem) {
      setEvents(prev => prev.map(e => e.id === event.id ? { ...e, needsPostMortem: false } : e))
      setFeedbackOnOpen(true)
    }
    setSelectedEvent(event)
    setCurrentPage('packing')
  }

  return (
    <div className="app">
      <div className="bg-hex-watermark" aria-hidden="true">
        <svg width="100%" height="100%" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
          {BG_HEXES.map((h, i) => (
            <polygon key={i} points={hexPoints(h.cx, h.cy, h.r)}
              fill="none" stroke="currentColor" strokeWidth="2" />
          ))}
        </svg>
      </div>
      <header className="header">
        <svg className="header-hexes" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
          width="100%" height="100%" viewBox="0 0 1440 64" preserveAspectRatio="xMaxYMid slice">
          {HEADER_HEXES.map((h, i) => (
            <polygon key={i} points={hexPoints(h.cx, h.cy, h.r)}
              fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" />
          ))}
        </svg>
        <h1 className="logo" onClick={() => setCurrentPage('home')}>
          DustReady
        </h1>
      </header>

      <main className="main">
        {currentPage === 'home' && (
          <HomePage
            events={events}
            onOpenEvent={handleOpenEvent}
            onEditEvent={handleEditEvent}
            onDeleteEvent={handleDeleteEvent}
            onNewEvent={() => setCurrentPage('create')}
            onDismissReminder={handleDismissReminder}
          />
        )}
        {currentPage === 'create' && (
          <CreateEventPage
            onAdd={handleAddEvent}
            onCancel={() => setCurrentPage('home')}
          />
        )}
        {currentPage === 'edit' && (
          <CreateEventPage
            initialEvent={editingEvent}
            onSave={handleSaveEvent}
            onCancel={() => setCurrentPage('home')}
          />
        )}
        {currentPage === 'lnt' && <LNTPage onBack={() => setCurrentPage('home')} />}
        {currentPage === 'about' && <AboutPage onBack={() => setCurrentPage('home')} />}
        {currentPage === 'packing' && selectedEvent && (
          <PackingListPage
            event={selectedEvent}
            onBack={() => { setCurrentPage('home'); setFeedbackOnOpen(false) }}
            initialFeedbackMode={feedbackOnOpen}
          />
        )}
      </main>

      <footer className="footer">
        <a className="footer-about" onClick={() => setCurrentPage('about')}>About</a>
        <a className="footer-lnt" onClick={() => setCurrentPage('lnt')}>Leave No Trace</a>
      </footer>

    </div>
  )
}

export default App
