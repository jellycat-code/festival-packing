import { useState, useEffect } from 'react'
import HomePage from './components/HomePage'

const HEX_PALETTE = ['#543005', '#8c510a', '#bf812d', '#dfc27d', '#c7eae5', '#80cdc1', '#35978f', '#01665e']

function buildHexBg(totalWidth, totalHeight) {
  const s = 20
  const hexW = +(s * Math.sqrt(3)).toFixed(2)
  const rowH = s * 1.5
  const cols = Math.ceil(totalWidth / hexW) + 2
  const rows = Math.ceil(totalHeight / rowH) + 2
  let polys = ''
  for (let r = -1; r < rows; r++) {
    for (let c = -1; c < cols; c++) {
      const cx = c * hexW + (r % 2 !== 0 ? hexW / 2 : 0)
      const cy = r * rowH + s
      const t = Math.max(0, Math.min(1, cx / totalWidth))
      const noise = (Math.abs(r * 7 + c * 13) % 5) / 14
      const idx = Math.min(HEX_PALETTE.length - 1, Math.max(0, Math.round((t + noise - 0.15) * (HEX_PALETTE.length - 1))))
      const pts = Array.from({ length: 6 }, (_, i) => {
        const a = (Math.PI / 3) * i - Math.PI / 6
        return `${(cx + s * Math.cos(a)).toFixed(1)},${(cy + s * Math.sin(a)).toFixed(1)}`
      }).join(' ')
      polys += `<polygon points="${pts}" fill="${HEX_PALETTE[idx]}" stroke="#f5f2ee" stroke-width="1"/>`
    }
  }
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${totalWidth}' height='${totalHeight}'>${polys}</svg>`
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
}
import CreateEventPage from './components/CreateEventPage'
import PackingListPage from './components/PackingListPage'
import LNTPage from './components/LNTPage'
import './App.css'

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
  const [headerBg, setHeaderBg] = useState('')

  useEffect(() => {
    setHeaderBg(buildHexBg(Math.max(window.innerWidth, 1440), 64))
  }, [])

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
      <header className="header" style={{ backgroundImage: headerBg }}>
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
