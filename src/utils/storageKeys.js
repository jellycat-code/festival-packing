// All localStorage keys used by DustReady.
// Schema:
//   fp_events            — array of event objects (id, name, location, dates, weather, status, etc.)
//   fp_list_{id}         — array of packing list items for event {id}
//   fp_notes_{id}        — freeform notes string for event {id}
//   fp_wish_{id}         — array of "Wish I'd Brought" items for event {id}

export const EVENTS_KEY = 'fp_events'
export const listKey = id => `fp_list_${id}`
export const notesKey = id => `fp_notes_${id}`
export const wishKey = id => `fp_wish_${id}`
