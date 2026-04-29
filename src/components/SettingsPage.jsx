import { useState } from 'react'
import { BLOCKLIST_KEY, USER_DEFAULTS_KEY } from '../utils/storageKeys'
import './SettingsPage.css'

function SettingsPage({ onBack }) {
  const [blocklist, setBlocklist] = useState(() => {
    try { return JSON.parse(localStorage.getItem(BLOCKLIST_KEY) || '[]') } catch { return [] }
  })
  const [userDefaults, setUserDefaults] = useState(() => {
    try { return JSON.parse(localStorage.getItem(USER_DEFAULTS_KEY) || '[]') } catch { return [] }
  })

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

  return (
    <div className="settings-page">
      <div className="settings-header">
        <button className="btn-back" onClick={onBack} aria-label="Back">←</button>
        <h2>Settings</h2>
      </div>

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
