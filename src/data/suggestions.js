// Master list of suggested items.
// condition: optional function — if it returns false for this event, the item is skipped.
// qty: number or function({ eventDays, buildDays, travelDays, totalDays }) => number
// singleton: true — never show a quantity stepper (always exactly 1)

const MASTER_LIST = [
  // IMPORTANT
  { name: 'Festival ticket / wristband', category: 'IMPORTANT', singleton: true },
  { name: 'Government-issued ID', category: 'IMPORTANT', singleton: true },
  { name: 'Printed event confirmation', category: 'IMPORTANT', singleton: true },
  { name: 'Cash', category: 'IMPORTANT', singleton: true },
  { name: 'Prescription medications', category: 'IMPORTANT', singleton: true },
  { name: 'Phone + charger', category: 'IMPORTANT', singleton: true },
  { name: 'Portable battery pack', category: 'IMPORTANT', singleton: true },

  // Build (only shown when event has build days)
  { name: 'Work gloves', category: 'Build', singleton: true },
  { name: 'Sturdy closed-toe work shoes', category: 'Build', singleton: true },
  { name: 'Safety goggles', category: 'Build', singleton: true },
  { name: 'Dust mask / respirator', category: 'Build', singleton: true },
  { name: 'Work clothes', category: 'Build', qty: ({ buildDays }) => Math.max(1, buildDays) },
  { name: 'Duct tape', category: 'Build', singleton: true },
  { name: 'Zip ties', category: 'Build', singleton: true },
  { name: 'Multi-tool', category: 'Build', singleton: true },

  // Food
  { name: 'Breakfast food', category: 'Food', singleton: true },
  { name: 'Lunch food', category: 'Food', singleton: true },
  { name: 'Dinner food', category: 'Food', singleton: true },
  { name: 'Snacks', category: 'Food', singleton: true },
  { name: 'Coffee or tea', category: 'Food', singleton: true },
  { name: 'Cooking oil', category: 'Food', singleton: true },
  { name: 'Spices / condiments', category: 'Food', singleton: true },
  { name: 'Cooler', category: 'Food', singleton: true },
  { name: 'Ice', category: 'Food', singleton: true },
  { name: 'Reusable water bottle', category: 'Food', singleton: true },
  { name: 'Water', category: 'Food', singleton: true },

  // Cooking
  { name: 'Camp stove', category: 'Cooking', singleton: true },
  { name: 'Fuel canisters', category: 'Cooking' },
  { name: 'Pots and pans', category: 'Cooking', singleton: true },
  { name: 'Cooking utensils', category: 'Cooking', singleton: true },
  { name: 'Plates and bowls', category: 'Cooking', singleton: true },
  { name: 'Cups / mugs', category: 'Cooking', singleton: true },
  { name: 'Reusable cutlery', category: 'Cooking', singleton: true },
  { name: 'Dish soap + sponge', category: 'Cooking', singleton: true },
  { name: 'Trash bags', category: 'Cooking', singleton: true },
  { name: 'Water pump', category: 'Cooking', singleton: true },
  { name: 'Graywater bucket', category: 'Cooking', singleton: true },

  // Comfort
  { name: 'Tent', category: 'Build', singleton: true },
  { name: 'Shade structure / canopy', category: 'Build', singleton: true },
  { name: 'Tent stakes and mallet', category: 'Build', singleton: true },
  { name: 'Sleeping bag', category: 'Comfort', singleton: true },
  { name: 'Sleeping pad', category: 'Comfort', singleton: true },
  { name: 'Pillow', category: 'Comfort', singleton: true },
  { name: 'Camp chair', category: 'Comfort', singleton: true },
  { name: 'Headlamp + extra batteries', category: 'Comfort', singleton: true },
  { name: 'Lantern', category: 'Comfort', singleton: true },

  // Personal Care
  { name: 'Toothbrush + toothpaste', category: 'Personal Care', singleton: true },
  { name: 'Deodorant', category: 'Personal Care', singleton: true },
  { name: 'Shampoo + conditioner', category: 'Personal Care', singleton: true },
  { name: 'Body wash / soap', category: 'Personal Care', singleton: true },
  { name: 'Towel', category: 'Personal Care' },
  { name: 'Washcloth', category: 'Personal Care' },
  { name: 'Toilet paper', category: 'Personal Care', singleton: true },
  { name: 'Hand sanitizer', category: 'Personal Care', singleton: true },
  { name: 'Sunscreen', category: 'Personal Care', singleton: true },
  { name: 'Lip balm with SPF', category: 'Personal Care', singleton: true },
  { name: 'First aid kit', category: 'Personal Care', singleton: true },
  { name: 'Pain reliever (ibuprofen / acetaminophen)', category: 'Personal Care', singleton: true },
  { name: 'Bug spray', category: 'Personal Care', singleton: true },
  { name: 'Ear plugs', category: 'Personal Care', singleton: true },

  // Clothing & Accessories
  { name: 'Underwear', category: 'Clothing & Accessories', qty: ({ eventDays }) => eventDays + 2 },
  { name: 'Socks', category: 'Clothing & Accessories', qty: ({ eventDays }) => eventDays + 2 },
  { name: 'T-shirts', category: 'Clothing & Accessories', qty: ({ eventDays }) => eventDays + 2 },
  { name: 'Pants / shorts', category: 'Clothing & Accessories', qty: ({ totalDays }) => Math.max(2, Math.ceil(totalDays / 3)) },
  { name: 'Sweater / layers', category: 'Clothing & Accessories', qty: ({ totalDays }) => Math.max(1, Math.ceil(totalDays / 3)) },
  { name: 'Closed-toe shoes', category: 'Clothing & Accessories', singleton: true },
  { name: 'Festival / costume outfits (day)', category: 'Clothing & Accessories', qty: ({ eventDays }) => eventDays },
  { name: 'Festival / costume outfits (night)', category: 'Clothing & Accessories', qty: ({ eventDays }) => eventDays },
  { name: 'Hat / sun protection', category: 'Clothing & Accessories', singleton: true },
  { name: 'Sunglasses', category: 'Clothing & Accessories', singleton: true },
  { name: 'Rain jacket', category: 'Clothing & Accessories', singleton: true, condition: e => e.weatherConditions?.includes('Rain') },
  { name: 'Heavy jacket / coat', category: 'Clothing & Accessories', singleton: true, condition: e => e.weatherLow !== null && e.weatherLow < 50 },
  { name: 'Snow boots', category: 'Clothing & Accessories', singleton: true, condition: e => e.weatherConditions?.includes('Snow') },
  { name: 'Bandana / buff', category: 'Clothing & Accessories', condition: e => e.weatherConditions?.includes('High Wind') || e.weatherConditions?.includes('Snow') },

  // Misc
  { name: 'Notebook + pen', category: 'Misc', singleton: true },
  { name: 'Bike + lock', category: 'Misc', singleton: true },
]

function computeQty(item, { eventDays, buildDays, travelDays, totalDays }) {
  if (typeof item.qty === 'function') {
    return Math.max(1, item.qty({ eventDays, buildDays, travelDays, totalDays }))
  }
  return item.qty || 1
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
  const start = new Date(event.startDate + 'T00:00:00')
  const end = new Date(event.endDate + 'T00:00:00')
  const eventDays = Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1
  const buildDays = event.buildDays || 0
  const travelDays = (event.travelDaysTo || 0) + (event.travelDaysFrom || 0)
  const totalDays = eventDays + buildDays + travelDays
  const dayContext = { eventDays, buildDays, travelDays, totalDays }

  return MASTER_LIST
    .filter(item => !item.condition || item.condition(event))
    .map((item, index) => ({
      id: `s_${index}_${Date.now()}`,
      name: item.name,
      category: item.category,
      quantity: item.singleton ? 1 : computeQty(item, dayContext),
      singleton: item.singleton || false,
      parentId: null,
      packed: false,
      needsToPurchase: false,
      custom: false,
      rejected: false,
    }))
}
