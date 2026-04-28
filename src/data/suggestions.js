// Master list of suggested items.
//
// Item fields:
//   name       — display name (and key for feedback history matching)
//   category   — must match a value in CATEGORY_ORDER
//   condition  — optional function(event) => boolean. Item is skipped if it returns false.
//   qty        — number or function({ eventDays, buildDays, travelDays, totalDays }) => number
//   singleton  — true means no quantity stepper (always exactly 1)
//   label      — optional function(dayContext) => string, overrides display name with a dynamic label
//   note       — optional string rendered as italic subtext below the item name
//   children   — optional array of { name, singleton } sub-items added automatically under this item
//
// Feedback pre-rejection: if a user marks an item "Didn't need" on a past event, it is pre-rejected
// on future suggestions UNLESS a condition function is actively triggering the item (e.g., rain jacket
// won't be pre-rejected if the current event has rain in the forecast).

// Display order for categories in the packing list and shopping list.
export const CATEGORY_ORDER = [
  'IMPORTANT',
  'Infrastructure',
  'Comfort',
  'Food',
  'Cooking & Eating',
  'Personal Care',
  'Clothing & Accessories',
  'Misc',
]

const MASTER_LIST = [
  // IMPORTANT
  { name: 'Ticket / wristband', category: 'IMPORTANT', singleton: true },
  { name: 'Photo ID', category: 'IMPORTANT', singleton: true },
  { name: 'Printed event confirmation', category: 'IMPORTANT', singleton: true },
  { name: 'Parking pass (if needed)', category: 'IMPORTANT', singleton: true },
  { name: 'Cash', category: 'IMPORTANT', singleton: true },
  { name: 'Prescription medications', category: 'IMPORTANT', singleton: true },

  // Infrastructure
  { name: 'Work gloves', category: 'Infrastructure', singleton: true },
  { name: 'Tent', category: 'Infrastructure', singleton: true },
  { name: 'Ground tarp(s)', category: 'Infrastructure', singleton: true },
  { name: 'Shade structure', category: 'Infrastructure', singleton: true },
  { name: 'Tent stakes or lag screws', category: 'Infrastructure', singleton: true },
  { name: 'Impact driver', category: 'Infrastructure', singleton: true },
  { name: 'Ratchet straps', category: 'Infrastructure', singleton: true },
  { name: 'Duct tape', category: 'Infrastructure', singleton: true },
  { name: 'Zip ties', category: 'Infrastructure', singleton: true },
  { name: 'Multi-tool', category: 'Infrastructure', singleton: true },
  { name: 'Power source', category: 'Infrastructure', singleton: true },
  { name: 'Graywater bucket', category: 'Infrastructure', singleton: true },
  { name: 'Shower bag', category: 'Infrastructure', singleton: true },
  { name: 'Lighting for outside tent', category: 'Infrastructure', singleton: true },
  { name: 'Trash bags', category: 'Infrastructure', singleton: true },

  // Food
  {
    name: 'Water', category: 'Food', singleton: true,
    note: 'Make sure you have enough for drinking, cooking, and hygiene, plus a little extra just in case!',
  },
  { name: 'Water pump', category: 'Food', singleton: true },
  { name: 'Electrolyte powder or tablets', category: 'Food', singleton: true },
  {
    name: 'Breakfast food', category: 'Food', singleton: true,
    label: ({ eventDays, buildDays }) => { const d = eventDays + buildDays; return `Breakfast for ${d} day${d !== 1 ? 's' : ''}` },
  },
  { name: 'Coffee / tea', category: 'Food', singleton: true },
  {
    name: 'Lunch food', category: 'Food', singleton: true,
    label: ({ eventDays, buildDays }) => { const d = eventDays + buildDays; return `Lunch for ${d} day${d !== 1 ? 's' : ''}` },
  },
  {
    name: 'Dinner food', category: 'Food', singleton: true,
    label: ({ eventDays, buildDays }) => { const d = eventDays + buildDays; return `Dinner for ${d} day${d !== 1 ? 's' : ''}` },
  },
  { name: 'Snacks', category: 'Food', singleton: true },
  { name: 'Seasonings and/or condiments', category: 'Food', singleton: true },
  { name: 'Cooking oil', category: 'Food', singleton: true },
  { name: 'Energy drinks', category: 'Food', singleton: true },

  // Cooking & Eating
  { name: 'Stove', category: 'Cooking & Eating', singleton: true },
  { name: 'Fuel for stove', category: 'Cooking & Eating', singleton: true },
  { name: 'Pots and pans', category: 'Cooking & Eating', singleton: true },
  { name: 'Cooking utensils', category: 'Cooking & Eating', singleton: true },
  { name: 'Plate', category: 'Cooking & Eating', singleton: true },
  { name: 'Bowl', category: 'Cooking & Eating', singleton: true },
  { name: 'Cup / mug', category: 'Cooking & Eating', singleton: true },
  { name: 'Eating utensils', category: 'Cooking & Eating', singleton: true },
  { name: 'Cooler', category: 'Cooking & Eating', singleton: true },
  { name: 'Ice', category: 'Cooking & Eating', singleton: true },
  { name: 'Dish soap & sponge', category: 'Cooking & Eating', singleton: true },
  { name: 'Paper towels', category: 'Cooking & Eating', singleton: true },

  // Comfort
  { name: 'Pillow', category: 'Comfort', singleton: true },
  { name: 'Sleeping bag or bedding', category: 'Comfort', singleton: true },
  { name: 'Sleeping pad or mattress', category: 'Comfort', singleton: true },
  { name: 'Fan or air conditioner', category: 'Comfort', singleton: true, condition: e => e.weatherHigh !== null && e.weatherHigh > 75 },
  { name: 'Camp chair', category: 'Comfort', singleton: true },
  { name: 'Lighting for inside tent', category: 'Comfort', singleton: true },

  // Personal Care
  { name: 'Toothbrush', category: 'Personal Care', singleton: true },
  { name: 'Toothpaste', category: 'Personal Care', singleton: true },
  { name: 'Floss', category: 'Personal Care', singleton: true },
  { name: 'Mouthwash', category: 'Personal Care', singleton: true },
  { name: 'Deodorant', category: 'Personal Care', singleton: true },
  { name: 'Razor / shaving supplies', category: 'Personal Care', singleton: true },
  { name: 'Skincare', category: 'Personal Care', singleton: true },
  { name: 'Makeup', category: 'Personal Care', singleton: true },
  { name: 'Contact lenses + solution', category: 'Personal Care', singleton: true },
  { name: 'Eyeglasses', category: 'Personal Care', singleton: true },
  { name: 'Hair care', category: 'Personal Care', singleton: true },
  { name: 'Hairbrush / comb', category: 'Personal Care', singleton: true },
  { name: 'Hair elastics', category: 'Personal Care', singleton: true },
  { name: 'Shampoo & conditioner', category: 'Personal Care', singleton: true },
  { name: 'Body wash', category: 'Personal Care', singleton: true },
  { name: 'Hand sanitizer', category: 'Personal Care', singleton: true },
  { name: 'Wipes', category: 'Personal Care', singleton: true },
  { name: 'Lotion', category: 'Personal Care', singleton: true },
  { name: 'Sunscreen', category: 'Personal Care', singleton: true },
  { name: 'Bug spray', category: 'Personal Care', singleton: true },
  { name: 'First aid kit', category: 'Personal Care', singleton: true },
  { name: 'OTC meds', category: 'Personal Care', singleton: true },
  { name: 'Pee bottle or portable toilet', category: 'Personal Care', singleton: true },
  { name: 'Toilet paper', category: 'Personal Care', singleton: true },
  { name: 'Lip balm', category: 'Personal Care', singleton: true },
  { name: 'Towel', category: 'Personal Care', singleton: true },
  { name: 'Washcloths', category: 'Personal Care', singleton: true },
  { name: 'Menstrual products', category: 'Personal Care', singleton: true },
  { name: 'Safer sex supplies', category: 'Personal Care', singleton: true },

  // Clothing & Accessories
  { name: 'Underwear', category: 'Clothing & Accessories', qty: ({ eventDays }) => eventDays + 2 },
  { name: 'Socks', category: 'Clothing & Accessories', qty: ({ eventDays }) => eventDays + 2 },
  { name: 'Outfits for travel', category: 'Clothing & Accessories', qty: ({ travelDays }) => Math.max(1, travelDays) },
  { name: 'Work clothes', category: 'Clothing & Accessories', qty: ({ buildDays }) => buildDays + 2 },
  { name: 'Boots', category: 'Clothing & Accessories', singleton: true },
  { name: 'Other shoes', category: 'Clothing & Accessories', singleton: true },
  { name: 'Warm jacket', category: 'Clothing & Accessories', singleton: true, condition: e => e.weatherLow !== null && e.weatherLow < 50 },
  { name: 'Festival / costume outfits (day)', category: 'Clothing & Accessories', qty: ({ eventDays }) => eventDays },
  { name: 'Festival / costume outfits (night)', category: 'Clothing & Accessories', qty: ({ eventDays }) => eventDays },
  { name: 'Kimono(s)', category: 'Clothing & Accessories', singleton: true },
  { name: 'Sunglasses', category: 'Clothing & Accessories', singleton: true },
  { name: 'Scarves', category: 'Clothing & Accessories', singleton: true },
  { name: 'Dust goggles', category: 'Clothing & Accessories', singleton: true },
  { name: 'Dust mask', category: 'Clothing & Accessories', singleton: true },
  { name: 'Sun hat', category: 'Clothing & Accessories', singleton: true },
  { name: 'Rain jacket', category: 'Clothing & Accessories', singleton: true, condition: e => e.weatherConditions?.includes('Rain') },
  { name: 'Warm hat', category: 'Clothing & Accessories', singleton: true, condition: e => e.weatherLow !== null && e.weatherLow < 50 },
  { name: 'Gloves', category: 'Clothing & Accessories', singleton: true, condition: e => e.weatherLow !== null && e.weatherLow < 50 },

  // Misc
  { name: 'Hydration pack', category: 'Misc', singleton: true },
  { name: 'Ear plugs', category: 'Misc', singleton: true },
  { name: 'Umbrella', category: 'Misc', singleton: true },
  { name: 'Headlamp', category: 'Misc', singleton: true },
  { name: 'Notebook + pen', category: 'Misc', singleton: true },
  {
    name: 'Bike', category: 'Misc', singleton: true,
    children: [
      { name: 'Lock', singleton: true },
      { name: 'Spare tube(s)', singleton: true },
      { name: 'Lights for bike', singleton: true },
    ],
  },
  { name: 'Any needed batteries', category: 'Misc', singleton: true },
  { name: 'All chargers or cords for devices', category: 'Misc', singleton: true },
  { name: 'Flow toys and other fun', category: 'Misc', singleton: true },
  { name: 'Light-up accessories', category: 'Misc', singleton: true },
  { name: 'Gifts or trinkets to give', category: 'Misc', singleton: true },
]

function computeQty(item, { eventDays, buildDays, travelDays, totalDays }) {
  if (typeof item.qty === 'function') {
    return Math.max(1, item.qty({ eventDays, buildDays, travelDays, totalDays }))
  }
  return item.qty || 1
}

// Reads feedback from all past event lists in localStorage.
// Returns:
//   didntNeed: Set of item names marked "didn't need" across past events
//   needMore:  Map of item name → total extra qty requested across past events
//   wishItems: Deduplicated array of { name } from all "Wish I'd Brought" lists
function readFeedbackHistory() {
  try {
    const events = JSON.parse(localStorage.getItem('fp_events') || '[]')
    const pastEvents = events.filter(e => e.status === 'past')

    const didntNeed = new Set()
    const needMore = {}
    const wishNames = new Set()
    const wishItems = []

    for (const event of pastEvents) {
      try {
        const items = JSON.parse(localStorage.getItem(`fp_list_${event.id}`) || '[]')
        for (const item of items) {
          if (item.feedback === 'didntNeed') {
            didntNeed.add(item.name)
          } else if (item.feedback === 'needMore') {
            const extra = item.feedbackQty || 1
            needMore[item.name] = (needMore[item.name] || 0) + extra
          }
        }
      } catch { /* skip corrupted list */ }

      try {
        const wishes = JSON.parse(localStorage.getItem(`fp_wish_${event.id}`) || '[]')
        for (const wish of wishes) {
          if (!wishNames.has(wish.name)) {
            wishNames.add(wish.name)
            wishItems.push(wish)
          }
        }
      } catch { /* skip corrupted wish list */ }
    }

    return { didntNeed, needMore, wishItems }
  } catch {
    return { didntNeed: new Set(), needMore: {}, wishItems: [] }
  }
}

// Applies current singleton flags to items already saved in localStorage.
// This way old lists don't need a full reset just to get the right UI.
export function migrateSavedItems(savedItems) {
  return savedItems.map(item => {
    if (item.parentId || item.custom) return item
    const master = MASTER_LIST.find(m => m.name === item.name)
    if (master?.singleton && !item.singleton) return { ...item, singleton: true }
    return item
  })
}

export function generateSuggestions(event) {
  const { didntNeed, needMore, wishItems } = readFeedbackHistory()

  let blocklist = []
  let userDefaults = []
  try { blocklist = JSON.parse(localStorage.getItem('fp_blocklist') || '[]') } catch {}
  try { userDefaults = JSON.parse(localStorage.getItem('fp_user_defaults') || '[]') } catch {}

  const start = new Date(event.startDate + 'T00:00:00')
  const end = new Date(event.endDate + 'T00:00:00')
  const eventDays = Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1
  const buildDays = event.buildDays || 0
  const travelDays = (event.travelDaysTo || 0) + (event.travelDaysFrom || 0)
  const totalDays = eventDays + buildDays + travelDays
  const dayContext = { eventDays, buildDays, travelDays, totalDays }

  const generated = []
  MASTER_LIST
    .filter(item => !item.condition || item.condition(event))
    .filter(item => !blocklist.includes(item.name))
    .forEach((item, index) => {
      const baseQty = item.singleton ? 1 : computeQty(item, dayContext)
      const extraQty = item.singleton ? 0 : (needMore[item.name] || 0)
      const quantity = Math.max(1, baseQty + extraQty)

      // Pre-reject if marked "didn't need" in past, unless a weather/condition
      // rule is actively triggering this item for the current event.
      const hasActiveCondition = Boolean(item.condition && item.condition(event))
      const preRejected = didntNeed.has(item.name) && !hasActiveCondition

      const parentId = `s_${index}_${Date.now()}`
      generated.push({
        id: parentId,
        name: item.name,
        label: typeof item.label === 'function' ? item.label(dayContext) : undefined,
        note: item.note || undefined,
        category: item.category,
        quantity,
        singleton: item.singleton || false,
        parentId: null,
        packed: false,
        needsToPurchase: false,
        custom: false,
        rejected: preRejected,
      })

      if (item.children) {
        item.children.forEach((child, ci) => {
          generated.push({
            id: `s_${index}_c${ci}_${Date.now()}`,
            name: child.name,
            category: item.category,
            quantity: 1,
            singleton: child.singleton || false,
            parentId,
            packed: false,
            needsToPurchase: false,
            custom: false,
            rejected: preRejected,
          })
        })
      }
    })

  // Inject wish items that aren't already covered by the generated list
  const generatedNames = new Set(generated.map(i => i.name))
  const wishSuggestions = wishItems
    .filter(w => !generatedNames.has(w.name))
    .map((w, i) => {
      const masterMatch = MASTER_LIST.find(m => m.name.toLowerCase() === w.name.toLowerCase())
      return {
        id: `w_${i}_${Date.now()}`,
        name: w.name,
        category: masterMatch?.category || 'Misc',
        quantity: 1,
        singleton: false,
        parentId: null,
        packed: false,
        needsToPurchase: false,
        custom: true,
        rejected: false,
      }
    })

  const userDefaultSuggestions = userDefaults
    .filter(d => !generatedNames.has(d.name) && !blocklist.includes(d.name))
    .map((d, i) => ({
      id: `ud_${i}_${Date.now()}`,
      name: d.name,
      category: d.category || 'Misc',
      quantity: 1,
      singleton: false,
      parentId: null,
      packed: false,
      needsToPurchase: false,
      custom: true,
      rejected: false,
    }))

  return [...generated, ...wishSuggestions, ...userDefaultSuggestions]
}
