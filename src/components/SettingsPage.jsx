import { useState } from 'react'
import {
  DndContext, closestCenter, PointerSensor, TouchSensor,
  KeyboardSensor, useSensor, useSensors,
} from '@dnd-kit/core'
import {
  SortableContext, verticalListSortingStrategy, useSortable,
  sortableKeyboardCoordinates, arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { BLOCKLIST_KEY, USER_DEFAULTS_KEY } from '../utils/storageKeys'
import {
  getCategories, addCategory, renameCategory, deleteCategory,
  reorderCategories, countItemsInCategory,
} from '../utils/categories'
import './SettingsPage.css'

function SortableCategory({ id, name, onRename, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(name)

  function commitRename() {
    const trimmed = draft.trim()
    if (trimmed && trimmed !== name) onRename(name, trimmed)
    setEditing(false)
  }

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 }}
      className="cat-row"
    >
      <button className="cat-drag-handle" {...attributes} {...listeners} aria-label="Drag to reorder">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
          <rect x="2" y="3" width="12" height="1.5" rx="0.75"/>
          <rect x="2" y="7.25" width="12" height="1.5" rx="0.75"/>
          <rect x="2" y="11.5" width="12" height="1.5" rx="0.75"/>
        </svg>
      </button>

      {editing ? (
        <input
          className="cat-rename-input"
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') commitRename()
            if (e.key === 'Escape') { setEditing(false); setDraft(name) }
          }}
          onBlur={commitRename}
          autoFocus
          aria-label="Rename category"
        />
      ) : (
        <span className="cat-name">{name}</span>
      )}

      <div className="cat-actions">
        {editing ? null : (
          <button className="btn-cat-action" onClick={() => { setDraft(name); setEditing(true) }}>Rename</button>
        )}
        <button className="btn-cat-action btn-cat-action--danger" onClick={() => onDelete(name)}>Delete</button>
      </div>
    </div>
  )
}

function SettingsPage({ onBack }) {
  const [blocklist, setBlocklist] = useState(() => {
    try { return JSON.parse(localStorage.getItem(BLOCKLIST_KEY) || '[]') } catch { return [] }
  })
  const [userDefaults, setUserDefaults] = useState(() => {
    try { return JSON.parse(localStorage.getItem(USER_DEFAULTS_KEY) || '[]') } catch { return [] }
  })
  const [categories, setCategories] = useState(() => getCategories())
  const [newCatName, setNewCatName] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState(null) // { name, count }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  function removeFromBlocklist(name) {
    const updated = blocklist.filter(n => n !== name)
    setBlocklist(updated)
    localStorage.setItem(BLOCKLIST_KEY, JSON.stringify(updated))
  }

  function removeFromDefaults(name) {
    const updated = userDefaults.filter(d => d.name !== name)
    setUserDefaults(updated)
    localStorage.setItem(USER_DEFAULTS_KEY, JSON.stringify(updated))
  }

  function handleDragEnd({ active, over }) {
    if (!over || active.id === over.id) return
    const oldIndex = categories.indexOf(active.id)
    const newIndex = categories.indexOf(over.id)
    const newOrder = arrayMove(categories, oldIndex, newIndex)
    setCategories(newOrder)
    reorderCategories(newOrder)
  }

  function handleRename(currentName, newName) {
    if (categories.includes(newName)) return
    renameCategory(currentName, newName)
    setCategories(prev => prev.map(c => c === currentName ? newName : c))
  }

  function handleDeleteRequest(name) {
    const count = countItemsInCategory(name)
    setDeleteConfirm({ name, count })
  }

  function confirmDelete() {
    if (!deleteConfirm) return
    const { name } = deleteConfirm
    const moveTo = categories.find(c => c !== name) ?? 'Misc'
    deleteCategory(name, moveTo)
    setCategories(prev => prev.filter(c => c !== name))
    setDeleteConfirm(null)
  }

  function handleAddCategory() {
    const name = newCatName.trim()
    if (!name || categories.includes(name)) return
    addCategory(name)
    setCategories(prev => [...prev, name])
    setNewCatName('')
  }

  return (
    <div className="settings-page">
      <div className="settings-header">
        <button className="btn-back" onClick={onBack} aria-label="Back">←</button>
        <h2>Settings</h2>
      </div>

      <section className="settings-section">
        <h3 className="settings-section-title">Categories</h3>
        <p className="settings-section-desc">Hold and drag to reorder. Rename or delete categories — items in a deleted category will be moved to the next available one.</p>

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={categories} strategy={verticalListSortingStrategy}>
            <div className="cat-list">
              {categories.map(name => (
                <SortableCategory
                  key={name}
                  id={name}
                  name={name}
                  onRename={handleRename}
                  onDelete={handleDeleteRequest}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        <div className="cat-add-form">
          <input
            type="text"
            value={newCatName}
            onChange={e => setNewCatName(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleAddCategory() }}
            placeholder="New category name"
            className="cat-add-input"
          />
          <button className="btn btn--primary" onClick={handleAddCategory}>Add</button>
        </div>

        {deleteConfirm && (
          <div className="cat-delete-confirm">
            <p>
              {deleteConfirm.count > 0
                ? `"${deleteConfirm.name}" has ${deleteConfirm.count} item${deleteConfirm.count !== 1 ? 's' : ''} — they'll be moved to the next category.`
                : `Delete "${deleteConfirm.name}"?`}
            </p>
            <div className="cat-delete-confirm-actions">
              <button className="btn btn--danger" onClick={confirmDelete}>Delete</button>
              <button className="btn btn--secondary" onClick={() => setDeleteConfirm(null)}>Cancel</button>
            </div>
          </div>
        )}
      </section>

      <section className="settings-section">
        <h3 className="settings-section-title">Blocked suggestions</h3>
        <p className="settings-section-desc">These items will never be recommended to you.</p>
        {blocklist.length === 0 ? (
          <p className="settings-empty">No blocked items.</p>
        ) : (
          <ul className="settings-list">
            {blocklist.map(name => (
              <li key={name} className="settings-list-item">
                <span className="settings-item-name">{name}</span>
                <button className="btn-settings-remove" onClick={() => removeFromBlocklist(name)}>Restore</button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="settings-section">
        <h3 className="settings-section-title">Your default items</h3>
        <p className="settings-section-desc">These items will be suggested on every new packing list.</p>
        {userDefaults.length === 0 ? (
          <p className="settings-empty">No saved default items.</p>
        ) : (
          <ul className="settings-list">
            {userDefaults.map(d => (
              <li key={d.name} className="settings-list-item">
                <span className="settings-item-name">{d.name}</span>
                <button className="btn-settings-remove" onClick={() => removeFromDefaults(d.name)}>Remove</button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}

export default SettingsPage
