// All localStorage keys used by DustReady.
// Schema:
//   fp_events            — array of event objects (id, name, location, dates, weather, status, etc.)
//   fp_list_{id}         — array of packing list items for event {id}
//   fp_notes_{id}        — freeform notes string for event {id}
//   fp_wish_{id}         — array of "Wish I'd Brought" items for event {id}
//   fp_prep_{id}         — array of { id, name, done } prep tasks for event {id}
//   fp_blocklist         — array of item name strings the user never wants suggested
//   fp_user_defaults     — array of { name, category } items always suggested on new lists

export const EVENTS_KEY = 'fp_events'
export const listKey = id => `fp_list_${id}`
export const notesKey = id => `fp_notes_${id}`
export const wishKey = id => `fp_wish_${id}`
export const prepKey = id => `fp_prep_${id}`
export const BLOCKLIST_KEY = 'fp_blocklist'
export const USER_DEFAULTS_KEY = 'fp_user_defaults'
export const USER_CATEGORIES_KEY = 'fp_user_categories'
