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

function PackingListPage({ event, onBack, onMarkComplete }) {
  const storageKey = `fp_list_${event.id}`
  const notesKey = `fp_notes_${event.id}`
  const wishKey = `fp_wish_${event.id}`

  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem(storageKey)
    return saved ? JSON.parse(saved) : generateSuggestions(event)
  })
  const [notes, setNotes] = useState(() => localStorage.getItem(notesKey) || '')
  const [wishItems, setWishItems] = useState(() => {
    const saved = localStorage.getItem(wishKey)
    return saved ? JSON.parse(saved) : []
  })

  const [view, setView] = useState('packing') // 'packing' | 'shopping'
  const [feedbackMode, setFeedbackMode] = useState(false)
  const [addingTo, setAddingTo] = useState(null)
  const [newItemName, setNewItemName] = useState('')
  const [newWishName, setNewWishName] = useState('')

  const isPast = event.status === 'past'

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(items))
  }, [items, storageKey])

  useEffect(() => {
    localStorage.setItem(notesKey, notes)
  }, [notes, notesKey])

  useEffect(() => {
    localStorage.setItem(wishKey, JSON.stringify(wishItems))
  }, [wishItems, wishKey])

  // --- Packing list actions ---
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

  function restoreItem(id) {
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, rejected: false } : item
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

  function resetSuggestions() {
    if (!window.confirm('This will wipe your current list and start fresh with new suggestions. Any items you added or changes you made will be lost. Continue?')) return
    setItems(generateSuggestions(event))
  }

  // --- Feedback actions ---
  function setItemFeedback(id, feedback) {
    setItems(prev => prev.map(item =>
      item.id === id
        ? { ...item, feedback: item.feedback === feedback ? null : feedback }
        : item
    ))
  }

  function addWishItem() {
    if (!newWishName.trim()) return
    setWishItems(prev => [...prev, { id: Date.now(), name: newWishName.trim() }])
    setNewWishName('')
  }

  function removeWishItem(id) {
    setWishItems(prev => prev.filter(i => i.id !== id))
  }

  function handleMarkComplete() {
    if (!window.confirm('Mark this event as complete? You can still view and add feedback to the packing list afterward.')) return
    onMarkComplete(event.id)
  }

  // --- Derived data ---
  const visibleItems = items.filter(i => !i.rejected)
  const rejectedItems = items.filter(i => i.rejected)
  const shoppingItems = visibleItems.filter(i => i.needsToPurchase)
  const activeCategories = CATEGORY_ORDER.filter(cat => visibleItems.some(i => i.category === cat))
  const shoppingCategories = CATEGORY_ORDER.filter(cat => shoppingItems.some(i => i.category === cat))

  return (
    <div className="packing-list-page">

      {/* Header */}
      <div className="packing-list-header">
        <button className="btn-back" onClick={onBack}>← Back to Events</button>
        <div className="packing-list-title">
          <h2>{event.name}</h2>
          <p>{event.location} &middot; {formatDateRange(event.startDate, event.endDate)}</p>
        </div>
        <div className="packing-list-header-actions">
          {!isPast && (
            <button className="btn-complete" onClick={handleMarkComplete}>
              Mark as Complete
            </button>
          )}
          <button className="btn-reset" onClick={resetSuggestions}>
            Reset suggestions
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="view-tabs">
        <button
          className={`view-tab ${view === 'packing' ? 'view-tab--active' : ''}`}
          onClick={() => setView('packing')}
        >
          Packing List
        </button>
        <button
          className={`view-tab ${view === 'shopping' ? 'view-tab--active' : ''}`}
          onClick={() => setView('shopping')}
        >
          Shopping List
          {shoppingItems.length > 0 && (
            <span className="tab-badge">{shoppingItems.length}</span>
          )}
        </button>
      </div>

      {/* ── SHOPPING LIST VIEW ── */}
      {view === 'shopping' && (
        <>
          {shoppingItems.length === 0 ? (
            <div className="empty-state-box">
              <p>No items marked for purchase yet.</p>
              <p>On the packing list, hit <strong>Buy?</strong> on anything you still need to get.</p>
            </div>
          ) : (
            shoppingCategories.map(category => {
              const catItems = shoppingItems.filter(i => i.category === category)
              return (
                <section key={category} className="category-section">
                  <h3 className="category-heading">{category}</h3>
                  <ul className="item-list">
                    {catItems.map(item => (
                      <li key={item.id} className="item-row">
                        <input
                          type="checkbox"
                          className="item-checkbox"
                          onChange={() => togglePurchase(item.id)}
                        />
                        <span className="item-name">{item.name}</span>
                        <span className="qty-label">×{item.quantity || 1}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )
            })
          )}
        </>
      )}

      {/* ── PACKING LIST VIEW ── */}
      {view === 'packing' && (
        <>
          {/* Post-event feedback banner */}
          {isPast && (
            <div className="feedback-banner">
              <div>
                <strong>How did packing go?</strong>
                <span> Flag what you didn't need or wish you'd had more of — it'll make future suggestions smarter.</span>
              </div>
              <button
                className={`btn-feedback-toggle ${feedbackMode ? 'btn-feedback-toggle--active' : ''}`}
                onClick={() => setFeedbackMode(prev => !prev)}
              >
                {feedbackMode ? 'Done' : 'Add feedback'}
              </button>
            </div>
          )}

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
                        {feedbackMode ? (
                          <>
                            <button
                              className={`btn-feedback ${item.feedback === 'didntNeed' ? 'btn-feedback--didnt-need' : ''}`}
                              onClick={() => setItemFeedback(item.id, 'didntNeed')}
                              title="Didn't actually need this"
                            >
                              Didn't need
                            </button>
                            <button
                              className={`btn-feedback ${item.feedback === 'needMore' ? 'btn-feedback--need-more' : ''}`}
                              onClick={() => setItemFeedback(item.id, 'needMore')}
                              title="Wish I had more of this"
                            >
                              Need more
                            </button>
                          </>
                        ) : (
                          <>
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
                            >
                              {item.needsToPurchase ? 'Buy ✓' : 'Buy?'}
                            </button>
                            <button className="btn-remove" onClick={() => removeItem(item.id)}>✕</button>
                          </>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>

                {!feedbackMode && (
                  addingTo === category ? (
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
                  )
                )}
              </section>
            )
          })}

          {!feedbackMode && (
            <section className="category-section category-section--new">
              <p className="add-category-hint">Don't see a category you need? Add items to Misc, or use the ✕ to clear out suggestions that don't apply to you.</p>
            </section>
          )}

          {/* Wish I'd brought — only in feedback mode */}
          {feedbackMode && (
            <section className="category-section category-section--wish">
              <h3 className="category-heading">Wish I'd Brought</h3>
              <p className="category-subtext">Anything you didn't have but wanted. We'll factor this into future suggestions.</p>
              {wishItems.length > 0 && (
                <ul className="item-list">
                  {wishItems.map(item => (
                    <li key={item.id} className="item-row">
                      <span className="item-name">{item.name}</span>
                      <button className="btn-remove" onClick={() => removeWishItem(item.id)}>✕</button>
                    </li>
                  ))}
                </ul>
              )}
              <div className="add-item-form">
                <input
                  type="text"
                  value={newWishName}
                  onChange={e => setNewWishName(e.target.value)}
                  placeholder="e.g. extra tarp, electrolyte packets..."
                  onKeyDown={e => { if (e.key === 'Enter') addWishItem() }}
                />
                <button className="btn btn--primary" onClick={addWishItem}>Add</button>
              </div>
            </section>
          )}

          {rejectedItems.length > 0 && !feedbackMode && (
            <section className="category-section category-section--rejected">
              <h3 className="category-heading category-heading--rejected">Rejected Suggestions</h3>
              <ul className="item-list">
                {rejectedItems.map(item => (
                  <li key={item.id} className="item-row item-row--rejected">
                    <span className="item-name">{item.name}</span>
                    <span className="item-category-tag">{item.category}</span>
                    <button className="btn-restore" onClick={() => restoreItem(item.id)}>Restore</button>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}

    </div>
  )
}

export default PackingListPage
