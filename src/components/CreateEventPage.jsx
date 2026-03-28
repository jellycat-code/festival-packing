import { useState } from 'react'
import './CreateEventPage.css'

const WEATHER_CONDITIONS = ['Rain', 'Snow', 'High Wind']

function CreateEventPage({ onAdd, onSave, onCancel, initialEvent }) {
  const editing = Boolean(initialEvent)

  const [dateError, setDateError] = useState('')

  const [form, setForm] = useState(() => {
    if (initialEvent) {
      return {
        ...initialEvent,
        weatherHigh: initialEvent.weatherHigh ?? '',
        weatherLow: initialEvent.weatherLow ?? '',
        weatherConditions: initialEvent.weatherConditions ?? [],
      }
    }
    return {
      name: '',
      location: '',
      website: '',
      startDate: '',
      endDate: '',
      travelDaysTo: 0,
      travelDaysFrom: 0,
      buildDays: 0,
      weatherHigh: '',
      weatherLow: '',
      weatherConditions: [],
    }
  })

  function handleChange(e) {
    const { name, value } = e.target
    if (name === 'startDate' || name === 'endDate') setDateError('')
    setForm(prev => ({ ...prev, [name]: value }))
  }

  function handleConditionToggle(condition) {
    setForm(prev => {
      const already = prev.weatherConditions.includes(condition)
      return {
        ...prev,
        weatherConditions: already
          ? prev.weatherConditions.filter(c => c !== condition)
          : [...prev.weatherConditions, condition],
      }
    })
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (form.startDate && form.endDate && form.endDate < form.startDate) {
      setDateError('End date must be on or after the start date.')
      return
    }
    const rawUrl = form.website.trim()
    const website = rawUrl && !rawUrl.match(/^https?:\/\//) ? 'https://' + rawUrl : rawUrl
    const updated = {
      ...form,
      website,
      travelDaysTo: Number(form.travelDaysTo),
      travelDaysFrom: Number(form.travelDaysFrom),
      buildDays: Number(form.buildDays),
      weatherHigh: form.weatherHigh !== '' ? Number(form.weatherHigh) : null,
      weatherLow: form.weatherLow !== '' ? Number(form.weatherLow) : null,
    }
    if (editing) {
      onSave(updated)
    } else {
      onAdd({ ...updated, id: Date.now(), status: 'planning' })
    }
  }

  return (
    <div className="create-event-page">
      {editing && <button className="btn-back" onClick={onCancel} aria-label="Back">←</button>}
      <h2>{editing ? 'Edit Event' : 'New Event'}</h2>
      <form className="event-form" onSubmit={handleSubmit}>

        <div className="form-group">
          <label htmlFor="name">Event Name</label>
          <input
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            placeholder="e.g. Burning Man 2026"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input
            id="location"
            name="location"
            type="text"
            value={form.location}
            onChange={handleChange}
            placeholder="e.g. Black Rock Desert, NV"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="website">Event Website <span className="form-label-optional">(optional)</span></label>
          <input
            id="website"
            name="website"
            type="text"
            value={form.website}
            onChange={handleChange}
            placeholder="e.g. burningman.org"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="startDate">Start Date</label>
            <input
              id="startDate"
              name="startDate"
              type="date"
              value={form.startDate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="endDate">End Date</label>
            <input
              id="endDate"
              name="endDate"
              type="date"
              value={form.endDate}
              onChange={handleChange}
              required
            />
            {dateError && <p className="form-error" role="alert">{dateError}</p>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="travelDaysTo">Travel Days (Getting There)</label>
            <input
              id="travelDaysTo"
              name="travelDaysTo"
              type="number"
              min="0"
              value={form.travelDaysTo}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="travelDaysFrom">Travel Days (Getting Home)</label>
            <input
              id="travelDaysFrom"
              name="travelDaysFrom"
              type="number"
              min="0"
              value={form.travelDaysFrom}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="buildDays">Build Days (Pre-Event)</label>
          <input
            id="buildDays"
            name="buildDays"
            type="number"
            min="0"
            value={form.buildDays}
            onChange={handleChange}
          />
          <span className="form-hint">Days spent on setup/build before the event starts. Affects work clothes and living essentials — not costumes or party gear.</span>
        </div>

        <fieldset className="form-fieldset">
          <legend>Weather Forecast</legend>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="weatherHigh">High Temp (°F)</label>
              <input
                id="weatherHigh"
                name="weatherHigh"
                type="number"
                value={form.weatherHigh}
                onChange={handleChange}
                placeholder="e.g. 95"
              />
            </div>
            <div className="form-group">
              <label htmlFor="weatherLow">Low Temp (°F)</label>
              <input
                id="weatherLow"
                name="weatherLow"
                type="number"
                value={form.weatherLow}
                onChange={handleChange}
                placeholder="e.g. 50"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Expected Conditions</label>
            <div className="checkbox-group">
              {WEATHER_CONDITIONS.map(condition => (
                <label key={condition} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={form.weatherConditions.includes(condition)}
                    onChange={() => handleConditionToggle(condition)}
                  />
                  {condition}
                </label>
              ))}
            </div>
          </div>
        </fieldset>

        <div className="form-actions">
          <button type="button" className="btn btn--secondary" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="btn btn--primary">
            {editing ? 'Save Changes' : 'Create Event'}
          </button>
        </div>

      </form>
    </div>
  )
}

export default CreateEventPage
