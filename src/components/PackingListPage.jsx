import { useState, useEffect } from 'react'
import { generateSuggestions } from '../data/suggestions'
import './PackingListPage.css'

const CATEGORY_ORDER = [
  'IMPORTANT',
  'Build',
  'Food',
  'Cooking',
  'Comfort',
  'Personal Care',
  'Clothing & Accessories',
  'Misc',
]

function formatDateRange(startStr, endStr) {
  const opts = { month: 'short', day: 'numeric' }
  const start = new Date(startStr + 'T00:00:00')
  const end = new Date(endStr + 'T00:00:00')
  return `${start.toLocaleDateString('en-US', opts)} – ${end.toLocaleDateString('en-US', { ...opts, year: 'numeric' })}`
}

function PackingListPage({ event, onBack }) {
  const storageKey = `fp_list_${event.id}`
  const notesKey = `fp_notes_${event.id}`

  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem(storageKey)
    return saved ? JSON.parse(saved) : generateSuggestions(event)
  })

  const [notes, setNotes] = useState(() => {
    return localStorage.getItem(notesKey) || ''
  })

  const [addingTo, setAddingTo] = useState(null)
  const [newItemName, setNewItemName] = useState('')

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(items))
  }, [items, storageKey])

  useEffect(() => {
    localStorage.setItem(notesKey, notes)
  }, [notes, notesKey])

  function togglePacked(id) {
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, packed: !item.packed } : item
    ))
  }

  function togglePurchase(id) {
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, needsToPurchase: !item.needsToPurchase } : item
    ))
  }

  function updateQuantity(id, value) {
    const qty = Math.max(1, Number(value) || 1)
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, quantity: qty } : item
    ))
  }

  function removeItem(id) {
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, rejected: true } : item
    ))
  }

  function addItem(category) {
    if (!newItemName.trim()) return
    setItems(prev => [...prev, {
      id: Date.now(),
      name: newItemName.trim(),
      category,
      quantity: 1,
      packed: false,
      needsToPurchase: false,
      custom: true,
      rejected: false,
    }])
    setNewItemName('')
    setAddingTo(null)
  }

  const visibleItems = items.filter(i => !i.rejected)

  const activeCategories = CATEGORY_ORDER.filter(cat =>
    visibleItems.some(i => i.category === cat)
  )

  return (
    <div className="packing-list-page">

      <div className="packing-list-header">
        <button className="btn-back" onClick={onBack}>← Back to Events</button>
        <div className="packing-list-title">
          <h2>{event.name}</h2>
          <p>{event.location} &middot; {formatDateRange(event.startDate, event.endDate)}</p>
        </div>
      </div>

      <div className="notes-section">
        <label htmlFor="notes">Notes</label>
        <textarea
          id="notes"
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="Camp address, gate times, carpool info, anything you need to remember..."
          rows={3}
        />
      </div>

      {activeCategories.map(category => {
        const categoryItems = visibleItems.filter(i => i.category === category)
        return (
          <section key={category} className="category-section">
            <h3 className="category-heading">{category}</h3>

            <ul className="item-list">
              {categoryItems.map(item => (
                <li key={item.id} className={`item-row ${item.packed ? 'item-row--packed' : ''}`}>
                  <input
                    type="checkbox"
                    checked={item.packed}
                    onChange={() => togglePacked(item.id)}
                    className="item-checkbox"
                  />
                  <span className="item-name">{item.name}</span>
                  <div className="item-actions">
                    <div className="item-qty">
                      <button
                        className="qty-btn"
                        onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)}
                        disabled={(item.quantity || 1) <= 1}
                      >−</button>
                      <span className="qty-value">{item.quantity || 1}</span>
                      <button
                        className="qty-btn"
                        onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                      >+</button>
                    </div>
                    <button
                      className={`btn-buy ${item.needsToPurchase ? 'btn-buy--active' : ''}`}
                      onClick={() => togglePurchase(item.id)}
                      title={item.needsToPurchase ? 'Remove from shopping list' : 'Add to shopping list'}
                    >
                      {item.needsToPurchase ? 'Buy ✓' : 'Buy?'}
                    </button>
                    <button
                      className="btn-remove"
                      onClick={() => removeItem(item.id)}
                      title="Remove item"
                    >
                      ✕
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            {addingTo === category ? (
              <div className="add-item-form">
                <input
                  type="text"
                  value={newItemName}
                  onChange={e => setNewItemName(e.target.value)}
                  placeholder="Item name"
                  onKeyDown={e => {
                    if (e.key === 'Enter') addItem(category)
                    if (e.key === 'Escape') { setAddingTo(null); setNewItemName('') }
                  }}
                  autoFocus
                />
                <button className="btn btn--primary" onClick={() => addItem(category)}>Add</button>
                <button className="btn btn--secondary" onClick={() => { setAddingTo(null); setNewItemName('') }}>Cancel</button>
              </div>
            ) : (
              <button className="btn-add-item" onClick={() => setAddingTo(category)}>
                + Add item
              </button>
            )}
          </section>
        )
      })}

      <section className="category-section category-section--new">
        <p className="add-category-hint">Don't see a category you need? Add items to Misc, or use the ✕ to clear out suggestions that don't apply to you.</p>
      </section>

    </div>
  )
}

export default PackingListPage
