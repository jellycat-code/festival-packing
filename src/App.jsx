import { useState, useEffect } from 'react'
import HomePage from './components/HomePage'
import CreateEventPage from './components/CreateEventPage'
import PackingListPage from './components/PackingListPage'
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
        {currentPage === 'packing' && selectedEvent && (
          <PackingListPage
            event={selectedEvent}
            onBack={() => setCurrentPage('home')}
          />
        )}
      </main>
    </div>
  )
}

export default App
