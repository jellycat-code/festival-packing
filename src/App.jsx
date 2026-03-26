import { useState } from 'react'
import HomePage from './components/HomePage'
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
    status: 'past',
  },
]

function App() {
  const [events] = useState(SAMPLE_EVENTS)
  const [currentPage, setCurrentPage] = useState('home')

  function handleOpenEvent(event) {
    // will navigate to packing list in Phase 4
    console.log('Open event:', event.name)
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
          <HomePage events={events} onOpenEvent={handleOpenEvent} />
        )}
      </main>
    </div>
  )
}

export default App
