// Master list of suggested items.
// condition: optional function — if it returns false for this event, the item is skipped.
// qty: number or function({ eventDays, buildDays, travelDays, totalDays }) => number

const MASTER_LIST = [
  // IMPORTANT
  { name: 'Festival ticket / wristband', category: 'IMPORTANT' },
  { name: 'Government-issued ID', category: 'IMPORTANT' },
  { name: 'Printed event confirmation', category: 'IMPORTANT' },
  { name: 'Cash', category: 'IMPORTANT' },
  { name: 'Prescription medications', category: 'IMPORTANT' },
  { name: 'Phone + charger', category: 'IMPORTANT' },
  { name: 'Portable battery pack', category: 'IMPORTANT' },

  // Build (only shown when event has build days)
  { name: 'Work gloves', category: 'Build', condition: e => (e.buildDays || 0) > 0 },
  { name: 'Sturdy closed-toe work shoes', category: 'Build', condition: e => (e.buildDays || 0) > 0 },
  { name: 'Safety goggles', category: 'Build', condition: e => (e.buildDays || 0) > 0 },
  { name: 'Dust mask / respirator', category: 'Build', condition: e => (e.buildDays || 0) > 0 },
  { name: 'Work clothes', category: 'Build', condition: e => (e.buildDays || 0) > 0, qty: ({ buildDays }) => buildDays },
  { name: 'Tool belt / tool bag', category: 'Build', condition: e => (e.buildDays || 0) > 0 },

  // Food
  { name: 'Breakfast food', category: 'Food' },
  { name: 'Lunch food', category: 'Food' },
  { name: 'Dinner food', category: 'Food' },
  { name: 'Snacks', category: 'Food' },
  { name: 'Coffee or tea', category: 'Food' },
  { name: 'Cooking oil', category: 'Food' },
  { name: 'Spices / condiments', category: 'Food' },
  { name: 'Cooler', category: 'Food' },
  { name: 'Ice', category: 'Food' },
  { name: 'Reusable water bottle', category: 'Food' },
  { name: 'Water (gallons)', category: 'Food' },

  // Cooking
  { name: 'Camp stove', category: 'Cooking' },
  { name: 'Fuel canisters', category: 'Cooking' },
  { name: 'Pots and pans', category: 'Cooking' },
  { name: 'Cooking utensils', category: 'Cooking' },
  { name: 'Plates and bowls', category: 'Cooking' },
  { name: 'Cups / mugs', category: 'Cooking' },
  { name: 'Reusable cutlery', category: 'Cooking' },
  { name: 'Dish soap + sponge', category: 'Cooking' },
  { name: 'Trash bags', category: 'Cooking' },

  // Comfort
  { name: 'Tent', category: 'Comfort' },
  { name: 'Sleeping bag', category: 'Comfort' },
  { name: 'Sleeping pad', category: 'Comfort' },
  { name: 'Pillow', category: 'Comfort' },
  { name: 'Camp chair', category: 'Comfort' },
  { name: 'Shade structure / canopy', category: 'Comfort' },
  { name: 'Rope / cordage', category: 'Comfort' },
  { name: 'Tent stakes and mallet', category: 'Comfort' },
  { name: 'Headlamp + extra batteries', category: 'Comfort' },
  { name: 'Lantern', category: 'Comfort' },

  // Personal Care
  { name: 'Toothbrush + toothpaste', category: 'Personal Care' },
  { name: 'Deodorant', category: 'Personal Care' },
  { name: 'Shampoo + conditioner', category: 'Personal Care' },
  { name: 'Body wash / soap', category: 'Personal Care' },
  { name: 'Towel', category: 'Personal Care' },
  { name: 'Toilet paper', category: 'Personal Care' },
  { name: 'Hand sanitizer', category: 'Personal Care' },
  { name: 'Sunscreen', category: 'Personal Care' },
  { name: 'Lip balm with SPF', category: 'Personal Care' },
  { name: 'First aid kit', category: 'Personal Care' },
  { name: 'Pain reliever (ibuprofen / acetaminophen)', category: 'Personal Care' },
  { name: 'Ear plugs', category: 'Personal Care', qty: ({ totalDays }) => totalDays },

  // Clothing & Accessories
  // Underwear and socks: 1 per day across the full trip
  { name: 'Underwear', category: 'Clothing & Accessories', qty: ({ totalDays }) => totalDays },
  { name: 'Socks', category: 'Clothing & Accessories', qty: ({ totalDays }) => totalDays },
  // T-shirts: 1 per day (you sweat)
  { name: 'T-shirts', category: 'Clothing & Accessories', qty: ({ totalDays }) => totalDays },
  // Pants can be worn multiple days
  { name: 'Pants / shorts', category: 'Clothing & Accessories', qty: ({ totalDays }) => Math.max(2, Math.ceil(totalDays / 3)) },
  // Layers can be worn multiple days
  { name: 'Sweater / layers', category: 'Clothing & Accessories', qty: ({ totalDays }) => Math.max(1, Math.ceil(totalDays / 3)) },
  { name: 'Closed-toe shoes', category: 'Clothing & Accessories' },
  // Costume outfits are just for festival days, not travel or build
  { name: 'Festival / costume outfits', category: 'Clothing & Accessories', qty: ({ eventDays }) => eventDays },
  { name: 'Hat / sun protection', category: 'Clothing & Accessories' },
  { name: 'Sunglasses', category: 'Clothing & Accessories' },
  { name: 'Rain jacket', category: 'Clothing & Accessories', condition: e => e.weatherConditions?.includes('Rain') },
  { name: 'Heavy jacket / coat', category: 'Clothing & Accessories', condition: e => e.weatherLow !== null && e.weatherLow < 50 },
  { name: 'Snow boots', category: 'Clothing & Accessories', condition: e => e.weatherConditions?.includes('Snow') },
  { name: 'Bandana / buff', category: 'Clothing & Accessories', condition: e => e.weatherConditions?.includes('High Wind') || e.weatherConditions?.includes('Snow') },
  { name: 'Goggles', category: 'Clothing & Accessories', condition: e => e.weatherConditions?.includes('High Wind') },

  // Misc
  { name: 'Bug spray', category: 'Misc' },
  { name: 'Lighter / matches', category: 'Misc' },
  { name: 'Duct tape', category: 'Misc' },
  { name: 'Zip ties', category: 'Misc' },
  { name: 'Multi-tool', category: 'Misc' },
  { name: 'Notebook + pen', category: 'Misc' },
  { name: 'Bike + lock', category: 'Misc' },
]

function computeQty(item, { eventDays, buildDays, travelDays, totalDays }) {
  if (typeof item.qty === 'function') {
    return Math.max(1, item.qty({ eventDays, buildDays, travelDays, totalDays }))
  }
  return item.qty || 1
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
      quantity: computeQty(item, dayContext),
      packed: false,
      needsToPurchase: false,
      custom: false,
      rejected: false,
    }))
}
