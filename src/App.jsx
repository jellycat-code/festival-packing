import { useState, useEffect } from 'react'
import HomePage from './components/HomePage'
import CreateEventPage from './components/CreateEventPage'
import PackingListPage from './components/PackingListPage'
import LNTPage from './components/LNTPage'
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
  { cx: 905,  cy: -6, r: 28 },  // medium, center area, clips top
]

const SAMPLE_EVENTS = [
  {
    id: 1,
    name: 'Burning Man 2026',
    location: 'Black Rock Desert, NV',
    startDate: '2026-08-30',
    endDate: '2026-09-07',
    travelDaysTo: 2,
    travelDaysFrom: 2,
    buildDays: 3,
    weatherHigh: 100,
    weatherLow: 45,
    weatherConditions: ['High Wind'],
    status: 'planning',
  },
  {
    id: 2,
    name: 'Arise Music Festival',
    location: 'Loveland, CO',
    startDate: '2025-08-08',
    endDate: '2025-08-10',
    travelDaysTo: 0,
    travelDaysFrom: 0,
    weatherHigh: 88,
    weatherLow: 55,
    weatherConditions: [],
    status: 'past',
  },
]

function App() {
  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem('fp_events')
    return saved ? JSON.parse(saved) : SAMPLE_EVENTS
  })
  const [currentPage, setCurrentPage] = useState('home')
  const [editingEvent, setEditingEvent] = useState(null)
  const [selectedEvent, setSelectedEvent] = useState(null)

  useEffect(() => {
    localStorage.setItem('fp_events', JSON.stringify(events))
  }, [events])

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

  function handleMarkComplete(eventId) {
    setEvents(prev => prev.map(e => e.id === eventId ? { ...e, status: 'past' } : e))
    setSelectedEvent(prev => ({ ...prev, status: 'past' }))
  }

  function handleDeleteEvent(event) {
    setEvents(prev => prev.filter(e => e.id !== event.id))
    localStorage.removeItem(`fp_list_${event.id}`)
    localStorage.removeItem(`fp_notes_${event.id}`)
  }

  function handleOpenEvent(event) {
    setSelectedEvent(event)
    setCurrentPage('packing')
  }

  return (
    <div className="app">
      <header className="header">
        <svg className="header-hexes" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
          {HEADER_HEXES.map((h, i) => (
            <polygon key={i} points={hexPoints(h.cx, h.cy, h.r)}
              fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" />
          ))}
        </svg>
        <h1 className="logo" onClick={() => setCurrentPage('home')}>
          Festival Packing
        </h1>
        <nav className="nav">
          <a onClick={() => setCurrentPage('home')}>My Events</a>
          <a onClick={() => setCurrentPage('create')}>New Event</a>
          <a onClick={() => setCurrentPage('lnt')}>Leave No Trace</a>
        </nav>
      </header>

      <main className="main">
        {currentPage === 'home' && (
          <HomePage events={events} onOpenEvent={handleOpenEvent} onEditEvent={handleEditEvent} onDeleteEvent={handleDeleteEvent} />
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
        {currentPage === 'lnt' && <LNTPage />}
        {currentPage === 'packing' && selectedEvent && (
          <PackingListPage
            event={selectedEvent}
            onBack={() => setCurrentPage('home')}
            onMarkComplete={handleMarkComplete}
          />
        )}
      </main>
    </div>
  )
}

export default App
