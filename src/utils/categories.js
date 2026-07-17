import { USER_CATEGORIES_KEY, EVENTS_KEY, USER_DEFAULTS_KEY } from './storageKeys'

export const DEFAULT_CATEGORIES = [
  'IMPORTANT',
  'Infrastructure',
  'Comfort',
  'Food',
  'Cooking & Eating',
  'Personal Care',
  'Clothing & Accessories',
  'Misc',
]

function listKey(id) { return `fp_list_${id}` }
function wishKey(id) { return `fp_wish_${id}` }

function loadConfig() {
  try {
    const saved = localStorage.getItem(USER_CATEGORIES_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed.order)) return { order: parsed.order, renames: parsed.renames || {} }
    }
  } catch {}
  return { order: [...DEFAULT_CATEGORIES], renames: {} }
}

function persist(order, renames) {
  localStorage.setItem(USER_CATEGORIES_KEY, JSON.stringify({ order, renames }))
}

function migrateItems(oldName, newName) {
  if (oldName === newName) return
  try {
    const events = JSON.parse(localStorage.getItem(EVENTS_KEY) || '[]')
    for (const event of events) {
      try {
        const key = listKey(event.id)
        const items = JSON.parse(localStorage.getItem(key) || '[]')
        localStorage.setItem(key, JSON.stringify(items.map(i => i.category === oldName ? { ...i, category: newName } : i)))
      } catch {}
      try {
        const wKey = wishKey(event.id)
        const wishes = JSON.parse(localStorage.getItem(wKey) || '[]')
        localStorage.setItem(wKey, JSON.stringify(wishes.map(w => w.category === oldName ? { ...w, category: newName } : w)))
      } catch {}
    }
  } catch {}
  try {
    const defaults = JSON.parse(localStorage.getItem(USER_DEFAULTS_KEY) || '[]')
    localStorage.setItem(USER_DEFAULTS_KEY, JSON.stringify(defaults.map(d => d.category === oldName ? { ...d, category: newName } : d)))
  } catch {}
}

export function getCategories() {
  return loadConfig().order
}

// Map of original MASTER_LIST category name → current display name.
// Used by generateSuggestions to apply renames to newly created items.
export function getCategoryRenames() {
  return loadConfig().renames
}

export function addCategory(name) {
  const { order, renames } = loadConfig()
  if (order.includes(name)) return
  persist([...order, name], renames)
}

export function renameCategory(currentName, newName) {
  const { order, renames } = loadConfig()
  const newOrder = order.map(c => c === currentName ? newName : c)

  // Find the MASTER_LIST original for this display name
  let original = currentName
  for (const [orig, disp] of Object.entries(renames)) {
    if (disp === currentName) { original = orig; break }
  }
  // If currentName itself is a default category name with no rename entry yet, it is its own original
  const newRenames = { ...renames, [original]: newName }

  persist(newOrder, newRenames)
  migrateItems(currentName, newName)
}

export function reorderCategories(newOrder) {
  const { renames } = loadConfig()
  persist(newOrder, renames)
}

export function deleteCategory(name, moveTo) {
  const { order, renames } = loadConfig()
  const newOrder = order.filter(c => c !== name)
  const target = moveTo && newOrder.includes(moveTo) ? moveTo : (newOrder[newOrder.length - 1] ?? 'Misc')

  // Remove rename entry if this was a renamed default
  const newRenames = { ...renames }
  for (const [orig, disp] of Object.entries(renames)) {
    if (disp === name) { delete newRenames[orig]; break }
  }

  migrateItems(name, target)
  persist(newOrder, newRenames)
}

export function countItemsInCategory(name) {
  let count = 0
  try {
    const events = JSON.parse(localStorage.getItem(EVENTS_KEY) || '[]')
    for (const event of events) {
      try {
        const items = JSON.parse(localStorage.getItem(listKey(event.id)) || '[]')
        count += items.filter(i => i.category === name).length
      } catch {}
    }
  } catch {}
  return count
}
