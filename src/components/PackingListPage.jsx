import { useState, useEffect, Fragment } from 'react'
import { generateSuggestions, migrateSavedItems, CATEGORY_ORDER } from '../data/suggestions'
import Modal from './Modal'
import ExternalLinkIcon from './ExternalLinkIcon'
import { formatDateRange } from '../utils/format'
import { listKey, notesKey as makeNotesKey, wishKey as makeWishKey, BLOCKLIST_KEY, USER_DEFAULTS_KEY } from '../utils/storageKeys'
import './PackingListPage.css'

function PackingListPage({ event, onBack, onEditEvent, initialFeedbackMode = false }) {
  const storageKey = listKey(event.id)
  const notesStorageKey = makeNotesKey(event.id)
  const wishStorageKey = makeWishKey(event.id)

  const [showChoice, setShowChoice] = useState(() => !localStorage.getItem(storageKey))
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      return saved ? migrateSavedItems(JSON.parse(saved)) : []
    } catch {
      return []
    }
  })
  const [notes, setNotes] = useState(() => localStorage.getItem(notesStorageKey) || '')
  const [wishItems, setWishItems] = useState(() => {
    try {
      const saved = localStorage.getItem(wishStorageKey)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  const [view, setView] = useState('packing')
  const [feedbackMode, setFeedbackMode] = useState(initialFeedbackMode)
  const [filterUnpacked, setFilterUnpacked] = useState(false)
  const [showDoneModal, setShowDoneModal] = useState(false)
  const [confirmModal, setConfirmModal] = useState(null) // { title, message, onConfirm }
  const [showResetModal, setShowResetModal] = useState(false)
  const [expandedRemoveId, setExpandedRemoveId] = useState(null)
  const [expandedBuyId, setExpandedBuyId] = useState(null)
  const [buyQty, setBuyQty] = useState(1)
  const [pendingBlocklist, setPendingBlocklist] = useState(new Set())
  const [pendingDefaults, setPendingDefaults] = useState(new Set())
  const [currentBlocklist, setCurrentBlocklist] = useState(() => {
    try { return JSON.parse(localStorage.getItem(BLOCKLIST_KEY) || '[]') } catch { return [] }
  })
  const [addingTo, setAddingTo] = useState(null)       // category name
  const [addingSubTo, setAddingSubTo] = useState(null) // parent item id
  const [newItemName, setNewItemName] = useState('')
  const [newSubItemName, setNewSubItemName] = useState('')
  const [newWishName, setNewWishName] = useState('')

  const isPast = event.status === 'past'

  useEffect(() => { localStorage.setItem(storageKey, JSON.stringify(items)) }, [items, storageKey])
  useEffect(() => { localStorage.setItem(notesStorageKey, notes) }, [notes, notesStorageKey])
  useEffect(() => { localStorage.setItem(wishStorageKey, JSON.stringify(wishItems)) }, [wishItems, wishStorageKey])

  // --- Item actions ---
  function togglePacked(id) {
    setItems(prev => prev.map(i => i.id === id ? { ...i, packed: !i.packed } : i))
  }
  function togglePurchase(id) {
    setItems(prev => prev.map(i => i.id === id ? { ...i, needsToPurchase: !i.needsToPurchase, purchased: false } : i))
  }
  function addToShoppingList(id, qty) {
    setItems(prev => prev.map(i => i.id === id ? { ...i, needsToPurchase: true, purchaseQty: qty, purchased: false } : i))
    setExpandedBuyId(null)
  }
  function updatePurchaseQty(id, qty) {
    setItems(prev => prev.map(i => i.id === id ? { ...i, purchaseQty: Math.max(1, qty) } : i))
  }
  function toggleItemPurchased(id) {
    setItems(prev => prev.map(i => i.id === id ? { ...i, purchased: !i.purchased } : i))
  }
  function updateQuantity(id, value) {
    const qty = Math.max(1, Number(value) || 1)
    setItems(prev => prev.map(i => i.id === id ? { ...i, quantity: qty } : i))
  }
  function removeItem(id) {
    setItems(prev => prev.map(i => i.id === id ? { ...i, rejected: true } : i))
  }
  function restoreItem(id) {
    setItems(prev => prev.map(i => i.id === id ? { ...i, rejected: false } : i))
  }
  function setItemFeedback(id, feedback) {
    setItems(prev => prev.map(i =>
      i.id === id ? { ...i, feedback: i.feedback === feedback ? null : feedback } : i
    ))
  }
  function setItemFeedbackQty(id, qty) {
    setItems(prev => prev.map(i => i.id === id ? { ...i, feedbackQty: Math.max(1, qty) } : i))
  }
  function resetSuggestions() {
    setConfirmModal({
      title: 'Reset suggestions?',
      message: 'This will wipe your current list and start fresh with new suggestions. Any items you added or changes you made will be lost.',
      onConfirm: () => setItems(generateSuggestions(event)),
    })
  }

  function startBlank() {
    setConfirmModal({
      title: 'Build from scratch?',
      message: 'This will clear your entire list so you can build your own. All current items will be removed.',
      onConfirm: () => setItems([]),
    })
  }

  function addItem(category) {
    if (!newItemName.trim()) return
    setItems(prev => [...prev, {
      id: Date.now(), name: newItemName.trim(), category,
      quantity: 1, singleton: false, parentId: null,
      packed: false, needsToPurchase: false, custom: true, rejected: false,
    }])
    setNewItemName('')
    setAddingTo(null)
  }

  function addSubItem(parentId) {
    if (!newSubItemName.trim()) return
    const parent = items.find(i => i.id === parentId)
    setItems(prev => [...prev, {
      id: Date.now(), name: newSubItemName.trim(),
      category: parent?.category || 'Misc',
      quantity: 1, singleton: false, parentId,
      packed: false, needsToPurchase: false, custom: true, rejected: false,
    }])
    setNewSubItemName('')
    setAddingSubTo(null)
  }

  function addWishItem() {
    if (!newWishName.trim()) return
    setWishItems(prev => [...prev, { id: Date.now(), name: newWishName.trim() }])
    setNewWishName('')
  }
  function removeWishItem(id) {
    setWishItems(prev => prev.filter(i => i.id !== id))
  }

  function addToBlocklist(itemName) {
    if (!currentBlocklist.includes(itemName)) {
      const updated = [...currentBlocklist, itemName]
      localStorage.setItem(BLOCKLIST_KEY, JSON.stringify(updated))
      setCurrentBlocklist(updated)
    }
  }

  function handleSaveBlocklist() {
    const updated = [...new Set([...currentBlocklist, ...pendingBlocklist])]
    localStorage.setItem(BLOCKLIST_KEY, JSON.stringify(updated))
    setCurrentBlocklist(updated)
    setPendingBlocklist(new Set())
  }

  function handleSaveDefaults() {
    let existing = []
    try { existing = JSON.parse(localStorage.getItem(USER_DEFAULTS_KEY) || '[]') } catch {}
    const existingNames = new Set(existing.map(d => d.name))
    const toAdd = [...pendingDefaults]
      .map(name => {
        const item = items.find(i => i.name === name)
        return { name, category: item?.category || 'Misc' }
      })
      .filter(d => !existingNames.has(d.name))
    localStorage.setItem(USER_DEFAULTS_KEY, JSON.stringify([...existing, ...toAdd]))
    setPendingDefaults(new Set())
  }

  // --- Derived data ---
  const visibleItems = items.filter(i => !i.rejected)
  const rejectedItems = items.filter(i => i.rejected)
  const shoppingItems = visibleItems.filter(i => i.needsToPurchase && !i.purchased)
  const purchasedItems = visibleItems.filter(i => i.needsToPurchase && i.purchased)
  const unpackedCount = visibleItems.filter(i => !i.packed).length
  const displayItems = filterUnpacked ? visibleItems.filter(i => !i.packed) : visibleItems
  const activeCategories = items.length === 0
    ? CATEGORY_ORDER
    : CATEGORY_ORDER.filter(cat => displayItems.some(i => i.category === cat && !i.parentId))
  const shoppingCategories = CATEGORY_ORDER.filter(cat => shoppingItems.some(i => i.category === cat))
  const removedSuggestions = items.filter(i => i.rejected && !i.custom && !i.parentId && !currentBlocklist.includes(i.name))
  const customAdded = items.filter(i => i.custom && !i.parentId)

  // Whether to show a quantity stepper for an item
  function showQty(item) {
    if (item.singleton) return false
    if (item.parentId) return true  // children always get stepper
    if (visibleItems.some(i => i.parentId === item.id)) return false  // parents don't
    return true
  }

  // Render actions for a single item row
  function renderActions(item, displayName) {
    const label = displayName || item.name
    if (feedbackMode) {
      return (
        <>
          <button
            className={`btn-feedback ${item.feedback === 'didntNeed' ? 'btn-feedback--didnt-need' : ''}`}
            onClick={() => setItemFeedback(item.id, 'didntNeed')}
            aria-pressed={item.feedback === 'didntNeed'}
          >Didn't need</button>
          <button
            className={`btn-feedback ${item.feedback === 'needMore' ? 'btn-feedback--need-more' : ''}`}
            onClick={() => setItemFeedback(item.id, 'needMore')}
            aria-pressed={item.feedback === 'needMore'}
          >Need more</button>
          {item.feedback === 'needMore' && (
            <div className="feedback-qty" role="group" aria-label={`Extra quantity needed for ${label}`}>
              <button className="qty-btn" onClick={() => setItemFeedbackQty(item.id, (item.feedbackQty || 1) - 1)} disabled={(item.feedbackQty || 1) <= 1} aria-label="Decrease extra quantity">−</button>
              <span className="qty-value">+{item.feedbackQty || 1}</span>
              <button className="qty-btn" onClick={() => setItemFeedbackQty(item.id, (item.feedbackQty || 1) + 1)} aria-label="Increase extra quantity">+</button>
            </div>
          )}
        </>
      )
    }
    return (
      <>
        {showQty(item) && (
          <div className="item-qty">
            <button className="qty-btn" onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)} disabled={(item.quantity || 1) <= 1} aria-label={`Decrease quantity of ${label}`}>−</button>
            <span className="qty-value" aria-live="polite">{item.quantity || 1}</span>
            <button className="qty-btn" onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)} aria-label={`Increase quantity of ${label}`}>+</button>
          </div>
        )}
        {item.category !== 'IMPORTANT' && (
          <button
            className={`btn-buy ${item.needsToPurchase ? 'btn-buy--active' : ''}`}
            onClick={() => {
              if (item.needsToPurchase) {
                togglePurchase(item.id)
              } else {
                setExpandedBuyId(prev => prev === item.id ? null : item.id)
                setBuyQty(item.quantity || 1)
                setExpandedRemoveId(null)
              }
            }}
            aria-pressed={item.needsToPurchase}
          >{item.needsToPurchase ? 'Buy ✓' : 'Buy?'}</button>
        )}
        <button
          className="btn-remove"
          onClick={() => {
            if (!item.custom && !item.parentId && item.category !== 'IMPORTANT') {
              setExpandedRemoveId(prev => prev === item.id ? null : item.id)
              setExpandedBuyId(null)
            } else {
              removeItem(item.id)
            }
          }}
          aria-label={`Remove ${label}`}
        >✕</button>
      </>
    )
  }

  return (
    <div className="packing-list-page">

      {/* Header */}
      <div className="packing-list-header">
        <button className="btn-back" onClick={onBack} aria-label="Back">←</button>
        <div className="packing-list-title">
          <h2>
            {event.name}
            {event.website && (
              <a href={event.website} target="_blank" rel="noopener noreferrer" className="event-site-link" aria-label="Event website">
                <ExternalLinkIcon size={13} />
              </a>
            )}
          </h2>
          <p>{event.location} &middot; {formatDateRange(event.startDate, event.endDate)}</p>
          <div className="packing-list-inline-actions">
            {onEditEvent && (
              <button className="btn-edit-event-inline" onClick={() => onEditEvent(event)}>Edit event</button>
            )}
            {!isPast && (
              <button className="btn-reset-list-inline" onClick={() => setShowResetModal(true)}>Reset packing list</button>
            )}
          </div>
        </div>
      </div>

      {/* First-open choice */}
      {showChoice && (
        <div className="list-choice">
          <p className="list-choice__heading">How do you want to start?</p>
          <div className="list-choice__options">
            <button
              className="list-choice__option"
              onClick={() => { setItems(generateSuggestions(event)); setShowChoice(false) }}
            >
              <span className="list-choice__option-title">Suggest a packing list</span>
              <span className="list-choice__option-desc">We'll generate a list based on your event details and past trips.</span>
            </button>
            <button
              className="list-choice__option"
              onClick={() => setShowChoice(false)}
            >
              <span className="list-choice__option-title">Start blank</span>
              <span className="list-choice__option-desc">Build your own list from scratch.</span>
            </button>
          </div>
        </div>
      )}

      {!showChoice && (<>

      <div className="notes-section">
        <label htmlFor="notes">Notes</label>
        <textarea
          id="notes" value={notes} onChange={e => setNotes(e.target.value)}
          placeholder="Camp address, gate times, carpool info, anything you need to remember..."
          rows={3}
        />
      </div>

      {/* Tabs */}
      <div className="view-tabs">
        <button className={`view-tab ${view === 'packing' ? 'view-tab--active' : ''}`} onClick={() => setView('packing')}>
          Packing List
        </button>
        <button className={`view-tab ${view === 'shopping' ? 'view-tab--active' : ''}`} onClick={() => setView('shopping')}>
          Shopping List
          {shoppingItems.length > 0 && <span className="tab-badge">{shoppingItems.length}</span>}
        </button>
      </div>

      {view === 'packing' && !isPast && !feedbackMode && (
        <div className="filter-toggle">
          <span
            className={`filter-toggle__label ${!filterUnpacked ? 'filter-toggle__label--active' : ''}`}
            onClick={() => setFilterUnpacked(false)}
          >Show all items</span>
          <button
            className={`filter-toggle__switch ${filterUnpacked ? 'filter-toggle__switch--on' : ''}`}
            onClick={() => setFilterUnpacked(prev => !prev)}
            aria-pressed={filterUnpacked}
            aria-label="Toggle between show all and what's left"
          >
            <span className="filter-toggle__thumb" />
          </button>
          <span
            className={`filter-toggle__label ${filterUnpacked ? 'filter-toggle__label--active' : ''}`}
            onClick={() => setFilterUnpacked(true)}
          >Show what's left</span>
        </div>
      )}

      {/* ── SHOPPING LIST VIEW ── */}
      {view === 'shopping' && (<>
        {shoppingItems.length === 0 && purchasedItems.length === 0 ? (
          <div className="empty-state-box">
            <p>No items marked for purchase yet.</p>
            <p>On the packing list, hit <strong>Buy?</strong> on anything you still need to get.</p>
          </div>
        ) : (
          shoppingCategories.map(category => (
            <section key={category} className="category-section">
              <h3 className="category-heading">{category}</h3>
              <ul className="item-list">
                {shoppingItems.filter(i => i.category === category).map(item => (
                  <li key={item.id} className={`item-row ${item.parentId ? 'item-row--child' : ''}`}>
                    <input type="checkbox" className="item-checkbox" onChange={() => toggleItemPurchased(item.id)} aria-label={`Mark ${item.name} as purchased`} />
                    <span className="item-name">{item.name}</span>
                    <div className="item-actions">
                      <div className="item-qty" role="group" aria-label={`Quantity for ${item.name}`}>
                        <button className="qty-btn" onClick={() => updatePurchaseQty(item.id, (item.purchaseQty || item.quantity || 1) - 1)} disabled={(item.purchaseQty || item.quantity || 1) <= 1} aria-label="Decrease quantity">−</button>
                        <span className="qty-value">{item.purchaseQty || item.quantity || 1}</span>
                        <button className="qty-btn" onClick={() => updatePurchaseQty(item.id, (item.purchaseQty || item.quantity || 1) + 1)} aria-label="Increase quantity">+</button>
                      </div>
                      <button className="btn-remove" onClick={() => togglePurchase(item.id)} aria-label={`Remove ${item.name} from shopping list`}>✕</button>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ))
        )}

        {purchasedItems.length > 0 && (
          <section className="category-section category-section--purchased">
            <h3 className="category-heading category-heading--purchased">Purchased</h3>
            <ul className="item-list">
              {purchasedItems.map(item => (
                <li key={item.id} className="item-row item-row--purchased">
                  <input type="checkbox" className="item-checkbox" checked onChange={() => toggleItemPurchased(item.id)} aria-label={`Mark ${item.name} as not purchased`} />
                  <span className="item-name">{item.name}</span>
                  <button className="btn-remove" onClick={() => togglePurchase(item.id)} aria-label={`Remove ${item.name} from shopping list`}>✕</button>
                </li>
              ))}
            </ul>
          </section>
        )}
      </>)}

      {/* ── PACKING LIST VIEW ── */}
      {view === 'packing' && (
        <>
          {isPast && (
            <div className="feedback-banner">
              <div>
                <strong>How did packing go?</strong>
                <span> Flag what you didn't need or wish you'd had more of — it'll make future suggestions smarter.</span>
              </div>
              <button
                className={`btn-feedback-toggle ${feedbackMode ? 'btn-feedback-toggle--active' : ''}`}
                onClick={() => setFeedbackMode(prev => !prev)}
              >{feedbackMode ? 'Done' : 'Add feedback'}</button>
            </div>
          )}

          {activeCategories.map(category => {
            const topLevel = displayItems.filter(i => i.category === category && !i.parentId)
            return (
              <section key={category} className="category-section">
                <h3 className="category-heading">{category}</h3>
                <ul className="item-list">
                  {topLevel.map(item => {
                    const children = displayItems.filter(i => i.parentId === item.id)
                    return (
                      <Fragment key={item.id}>
                        {/* Parent row */}
                        <li className={`item-row ${item.packed ? 'item-row--packed' : ''}`}>
                          <input type="checkbox" checked={item.packed} onChange={() => togglePacked(item.id)} className="item-checkbox" aria-label={`Mark ${item.label || item.name} as packed`} />
                          <div className="item-main">
                            <span className="item-name">{item.label || item.name}</span>
                            {item.note && <span className="item-note">{item.note}</span>}
                            {!feedbackMode && (
                              <button
                                className="btn-add-sub"
                                onClick={() => { setAddingSubTo(item.id); setAddingTo(null) }}
                              >+ sub-item</button>
                            )}
                          </div>
                          <div className="item-actions">{renderActions(item, item.label || item.name)}</div>
                        </li>

                        {/* Children */}
                        {children.map(child => (
                          <li key={child.id} className={`item-row item-row--child ${child.packed ? 'item-row--packed' : ''}`}>
                            <input type="checkbox" checked={child.packed} onChange={() => togglePacked(child.id)} className="item-checkbox" aria-label={`Mark ${child.name} as packed`} />
                            <span className="item-name">{child.name}</span>
                            <div className="item-actions">{renderActions(child, child.name)}</div>
                          </li>
                        ))}

                        {/* Buy expand */}
                        {!feedbackMode && expandedBuyId === item.id && !item.needsToPurchase && (
                          <li className="item-row item-row--buy-expand">
                            <div className="buy-expand-spacer" />
                            <div className="buy-expand-actions">
                              <div className="buy-expand-qty" role="group" aria-label={`Quantity to buy for ${item.label || item.name}`}>
                                <button className="qty-btn" onClick={() => setBuyQty(q => Math.max(1, q - 1))} disabled={buyQty <= 1} aria-label="Decrease quantity">−</button>
                                <span className="qty-value">{buyQty}</span>
                                <button className="qty-btn" onClick={() => setBuyQty(q => q + 1)} aria-label="Increase quantity">+</button>
                                {buyQty !== (item.quantity || 1) && (
                                  <em className="buy-expand-recommended">recommended: {item.quantity || 1}</em>
                                )}
                              </div>
                              <button className="btn-buy-confirm" onClick={() => addToShoppingList(item.id, buyQty)} aria-label="Add to shopping list">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                  <path d="M2 21l21-9L2 3v7l15 2-15 2z"/>
                                </svg>
                              </button>
                              <button className="btn-remove-cancel" onClick={() => setExpandedBuyId(null)} aria-label="Cancel">✕</button>
                            </div>
                          </li>
                        )}

                        {/* Remove expand */}
                        {!feedbackMode && expandedRemoveId === item.id && (
                          <li className="item-row item-row--remove-expand">
                            <div className="remove-expand-actions">
                              <button className="btn-remove-once" onClick={() => { removeItem(item.id); setExpandedRemoveId(null) }}>
                                Remove this time
                              </button>
                              <button className="btn-remove-never" onClick={() => { addToBlocklist(item.name); removeItem(item.id); setExpandedRemoveId(null) }}>
                                Don't suggest again
                              </button>
                              <button className="btn-remove-cancel" onClick={() => setExpandedRemoveId(null)}>
                                Cancel
                              </button>
                            </div>
                          </li>
                        )}

                        {/* Add sub-item form */}
                        {!feedbackMode && addingSubTo === item.id && (
                          <li className="item-row item-row--add-sub-form">
                            <div className="add-item-form add-item-form--sub">
                              <input
                                type="text" value={newSubItemName}
                                onChange={e => setNewSubItemName(e.target.value)}
                                placeholder="Sub-item name"
                                onKeyDown={e => {
                                  if (e.key === 'Enter') addSubItem(item.id)
                                  if (e.key === 'Escape') { setAddingSubTo(null); setNewSubItemName('') }
                                }}
                                autoFocus
                              />
                              <button className="btn btn--primary" onClick={() => addSubItem(item.id)}>Add</button>
                              <button className="btn btn--secondary" onClick={() => { setAddingSubTo(null); setNewSubItemName('') }}>Cancel</button>
                            </div>
                          </li>
                        )}
                      </Fragment>
                    )
                  })}
                </ul>

                {!feedbackMode && (
                  addingTo === category ? (
                    <div className="add-item-form">
                      <input
                        type="text" value={newItemName}
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
                    <button className="btn-add-item" onClick={() => { setAddingTo(category); setAddingSubTo(null) }}>
                      + Add item
                    </button>
                  )
                )}
              </section>
            )
          })}

          {!feedbackMode && (
            <section className="category-section category-section--new">
              <p className="add-category-hint">Don't see a category you need? Add items to Misc, or use ✕ to clear out suggestions that don't apply to you.</p>
            </section>
          )}

          {feedbackMode && (
            <section className="category-section category-section--wish">
              <h3 className="category-heading">Wish I'd Brought</h3>
              <p className="category-subtext">Anything you didn't have but wanted. We'll factor this into future suggestions.</p>
              {wishItems.length > 0 && (
                <ul className="item-list">
                  {wishItems.map(item => (
                    <li key={item.id} className="item-row">
                      <span className="item-name">{item.name}</span>
                      <button className="btn-remove" onClick={() => removeWishItem(item.id)} aria-label={`Remove ${item.name} from wish list`}>✕</button>
                    </li>
                  ))}
                </ul>
              )}
              <div className="add-item-form">
                <input
                  type="text" value={newWishName}
                  onChange={e => setNewWishName(e.target.value)}
                  placeholder="e.g. extra tarp, electrolyte packets..."
                  onKeyDown={e => { if (e.key === 'Enter') addWishItem() }}
                />
                <button className="btn btn--primary" onClick={addWishItem}>Add</button>
              </div>
            </section>
          )}

          {feedbackMode && removedSuggestions.length > 0 && (
            <section className="category-section category-section--review">
              <h3 className="category-heading">Suggestions you removed</h3>
              <p className="category-subtext">Check the items you want removed from future recommendations.</p>
              <ul className="review-checklist">
                {removedSuggestions.map(item => (
                  <li key={item.id} className="review-check-item">
                    <input
                      type="checkbox"
                      className="item-checkbox"
                      id={`block-${item.id}`}
                      checked={pendingBlocklist.has(item.name)}
                      onChange={() => setPendingBlocklist(prev => {
                        const next = new Set(prev)
                        if (next.has(item.name)) next.delete(item.name)
                        else next.add(item.name)
                        return next
                      })}
                    />
                    <label htmlFor={`block-${item.id}`} className="item-name">{item.name}</label>
                  </li>
                ))}
              </ul>
              {pendingBlocklist.size > 0 && (
                <button className="btn btn--primary" onClick={handleSaveBlocklist}>
                  Remove from future recommendations
                </button>
              )}
            </section>
          )}

          {feedbackMode && customAdded.length > 0 && (
            <section className="category-section category-section--review">
              <h3 className="category-heading">Custom items you added</h3>
              <p className="category-subtext">Check the items you want added to future recommendations.</p>
              <ul className="review-checklist">
                {customAdded.map(item => (
                  <li key={item.id} className="review-check-item">
                    <input
                      type="checkbox"
                      className="item-checkbox"
                      id={`default-${item.id}`}
                      checked={pendingDefaults.has(item.name)}
                      onChange={() => setPendingDefaults(prev => {
                        const next = new Set(prev)
                        if (next.has(item.name)) next.delete(item.name)
                        else next.add(item.name)
                        return next
                      })}
                    />
                    <label htmlFor={`default-${item.id}`} className="item-name">{item.name}</label>
                  </li>
                ))}
              </ul>
              {pendingDefaults.size > 0 && (
                <button className="btn btn--primary" onClick={handleSaveDefaults}>
                  Add to future recommendations
                </button>
              )}
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

          {!isPast && (
            <div className="done-packing-section">
              <button className="btn btn--primary" onClick={() => setShowDoneModal(true)}>
                Done Packing
              </button>
            </div>
          )}
        </>
      )}

      </>)} {/* end !showChoice */}

      <Modal isOpen={showDoneModal} onClose={() => setShowDoneModal(false)} labelId="done-modal-title">
        <h3 id="done-modal-title">You're all packed!</h3>
        <p>Have an amazing time at <strong>{event.name}</strong>!</p>
        <div className="modal-actions">
          <button className="btn btn--primary" onClick={() => setShowDoneModal(false)}>Let's go!</button>
        </div>
      </Modal>

      <Modal isOpen={confirmModal !== null} onClose={() => setConfirmModal(null)} labelId="confirm-modal-title">
        <h3 id="confirm-modal-title">{confirmModal?.title}</h3>
        <p>{confirmModal?.message}</p>
        <div className="modal-actions">
          <button className="btn btn--danger" onClick={() => { confirmModal.onConfirm(); setConfirmModal(null) }}>Continue</button>
          <button className="btn btn--secondary" onClick={() => setConfirmModal(null)}>Cancel</button>
        </div>
      </Modal>

      <Modal isOpen={showResetModal} onClose={() => setShowResetModal(false)} labelId="reset-modal-title">
        <h3 id="reset-modal-title">Reset packing list</h3>
        <div className="reset-modal-options">
          <button className="reset-modal-option" onClick={() => { setShowResetModal(false); resetSuggestions() }}>
            <span className="reset-modal-option__title">Reset suggestions</span>
            <span className="reset-modal-option__desc">Start fresh with a new suggested list based on your event details.</span>
          </button>
          <button className="reset-modal-option" onClick={() => { setShowResetModal(false); startBlank() }}>
            <span className="reset-modal-option__title">Start from scratch</span>
            <span className="reset-modal-option__desc">Clear everything and build your own list from scratch.</span>
          </button>
        </div>
        <div className="modal-actions">
          <button className="btn btn--secondary" onClick={() => setShowResetModal(false)}>Cancel</button>
        </div>
      </Modal>

    </div>
  )
}

export default PackingListPage
