import { useState, useRef } from 'react'
import './AboutPage.css'

function AccordionSection({ title, children, open, onToggle }) {
  return (
    <div className={`accordion-section ${open ? 'accordion-section--open' : ''}`}>
      <button className="accordion-header" onClick={onToggle} aria-expanded={open}>
        <span>{title}</span>
        <svg className="accordion-chevron" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      {open && <div className="accordion-body">{children}</div>}
    </div>
  )
}

function FeedbackForm() {
  const [status, setStatus] = useState('idle') // idle | sending | success | error
  const [name, setName] = useState('')
  const [type, setType] = useState('General feedback')
  const [message, setMessage] = useState('')
  const messageRef = useRef(null)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim() || !message.trim()) {
      if (!name.trim()) document.getElementById('fb-name')?.focus()
      else messageRef.current?.focus()
      return
    }
    setStatus('sending')
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, type, message }),
      })
      if (res.ok) {
        setStatus('success')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="feedback-success">
        <p>Thanks for reaching out — I'll read every message.</p>
      </div>
    )
  }

  return (
    <form className="feedback-form" onSubmit={handleSubmit} noValidate>
      <div className="feedback-row">
        <div className="feedback-field">
          <label htmlFor="fb-name">Your name</label>
          <input
            id="fb-name"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            autoComplete="name"
            required
          />
        </div>
        <div className="feedback-field">
          <label htmlFor="fb-type">Type</label>
          <select id="fb-type" value={type} onChange={e => setType(e.target.value)}>
            <option>General feedback</option>
            <option>Bug report</option>
            <option>Feature suggestion</option>
          </select>
        </div>
      </div>
      <div className="feedback-field">
        <label htmlFor="fb-message">Message</label>
        <textarea
          id="fb-message"
          ref={messageRef}
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="What's on your mind?"
          rows={4}
          required
        />
      </div>
      {status === 'error' && (
        <p className="feedback-error">Something went wrong — please try again.</p>
      )}
      <button type="submit" className="btn btn--primary feedback-submit" disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending…' : 'Send'}
      </button>
    </form>
  )
}

function AboutPage({ onBack }) {
  const [openSection, setOpenSection] = useState('how-it-works')

  function toggle(id) {
    setOpenSection(prev => prev === id ? null : id)
  }

  return (
    <div className="about-page">

      <button className="btn-back" onClick={onBack} aria-label="Back">←</button>

      <div className="about-header">
        <h2>About DustReady</h2>
        <p>A packing list tool built specifically for festival and burn culture — not generic camping, not a grocery list. It suggests a starting list based on your event details, learns from your past trips, and gets smarter every time you pack.</p>
      </div>

      <div className="accordion">

        <AccordionSection title="How it works" open={openSection === 'how-it-works'} onToggle={() => toggle('how-it-works')}>
          <div className="about-card">
            <h4 className="about-card__heading">Creating an event</h4>
            <p>Add your event details. Quantities of different kinds of days (travel, build, and event) will adjust recommended quantities for some items, and the weather conditions trigger appropriate gear recommendations. Eventually, weather data will be fetched and updated automatically, but for now you'll have to input it manually if you want those suggestions to be triggered.</p>
            <p>You can edit your event details at any time — either from the dashboard or directly from your packing list.</p>
          </div>

          <div className="about-card">
            <h4 className="about-card__heading">Your packing list</h4>
            <p>When you first open a new event, you can ask DustReady to <strong>Suggest a packing list</strong> or <strong>Start from scratch</strong>.</p>
            <ul className="about-list">
              <li>Toggle between <strong>Show all items</strong> and <strong>Show what's left</strong> to filter your list</li>
              <li>Add custom items to any category</li>
              <li>Add sub-items under any item (hover or focus an item to see <strong>+ sub-item</strong>)</li>
              <li>Adjust quantities using the − and + buttons</li>
              <li>Check items off as you pack them</li>
              <li>Remove items that don't apply with <strong>✕</strong>
                <ul className="about-list">
                  <li><strong>Remove this time</strong> — drops it from this list only</li>
                  <li><strong>Don't suggest again</strong> — removes it from future recommendations</li>
                </ul>
              </li>
              <li>Mark items you still need to buy with <strong>Buy?</strong> — they'll appear on a separate Shopping List tab</li>
              <li>Made a mistake or want to start over? Tap <strong>Reset packing list</strong> below your event details to reset to suggestions or start from scratch</li>
            </ul>
          </div>

          <div className="about-card">
            <h4 className="about-card__heading">The Shopping List</h4>
            <p>When you mark an item with <strong>Buy?</strong>, it gets added to your Shopping List tab. From there you can:</p>
            <ul className="about-list">
              <li>Adjust how many you need to buy using the − and + buttons</li>
              <li>Check items off as you purchase them — they'll move to a Purchased section at the bottom</li>
              <li>Remove items from the list with <strong>✕</strong></li>
            </ul>
          </div>

          <div className="about-card">
            <h4 className="about-card__heading">After your event</h4>
            <p>Once an event has passed, you'll see a feedback banner on your packing list. Tap <strong>Add feedback</strong> to review what you packed and tell DustReady how it went:</p>
            <ul className="about-list">
              <li><strong>Didn't need</strong> — flags an item so it won't be suggested by default next time</li>
              <li><strong>Need more</strong> — lets you specify how many extra you wished you'd had; DustReady will bump the quantity next time</li>
              <li><strong>Wish I'd Brought</strong> — add anything you wished you'd had but didn't pack; it'll be suggested on future trips</li>
            </ul>
            <p className="about-note">When you remove an item with ✕, you can choose <strong>Remove this time</strong> to only drop it from the current list, or <strong>Don't suggest again</strong> to permanently remove it from future recommendations. You can also review removed suggestions and custom items in the post-event feedback to update your defaults. Manage everything in <strong>Settings</strong>.</p>
          </div>

          <div className="about-card">
            <h4 className="about-card__heading">Leave No Trace</h4>
            <p>Leaving the land as you found it — or better — is one of the most important things you can do as a festival and burn participant. Tap <strong>Leave No Trace</strong> in the footer to learn more about the principles.</p>
          </div>
        </AccordionSection>

        <AccordionSection title="About the developer" open={openSection === 'about-developer'} onToggle={() => toggle('about-developer')}>
          <div className="about-card about-card--developer">
            <div className="developer-bio">
              <p>Hi, I'm Amanda — a former therapist, aerial artist, and self-taught developer based in Denver, CO.</p>
              <p>My first burn was Apogaea 2024. I went as someone who was trying very hard to be who everyone else thought she should be, and I came home knowing that wasn't going to work anymore. What followed was a year of figuring out who I actually am — more regionals, Burning Man 2025, a lot of lyra training, and eventually leaving my career in therapy with no plan and no idea what came next.</p>
              <p>I started coding as a distraction, honestly. My partner is a software engineer, and learning from him — and getting to code alongside each other — turned out to be an unexpectedly joyful part of rebuilding my life. I still don't understand most of his projects, but DustReady is entirely mine.</p>
              <p>I built it because for every event, I was rewriting the same packing list by hand. Even when I missed something or brought things I never used, none of that carried over to the next trip. I wanted something that actually learns — that gets smarter every time I pack, so I can stop starting from scratch.</p>
            </div>
            <div className="developer-links">
              <a href="https://jellycat.boo" target="_blank" rel="noopener noreferrer" aria-label="Personal website">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="2" y1="12" x2="22" y2="12"/>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                </svg>
              </a>
              <a href="https://instagram.com/jellycat.aerial" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <circle cx="12" cy="12" r="4"/>
                  <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
                </svg>
              </a>
              <a href="https://www.linkedin.com/in/amandatlee/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                  <rect x="2" y="9" width="4" height="12"/>
                  <circle cx="4" cy="4" r="2"/>
                </svg>
              </a>
              <a href="mailto:jellycat.code@gmail.com" aria-label="Email">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </a>
            </div>
          </div>
        </AccordionSection>

        <AccordionSection title="Help improve DustReady" open={openSection === 'help-improve'} onToggle={() => toggle('help-improve')}>
          <div className="about-card">
            <div className="improve-item">
              <h4 className="about-card__heading">Share feedback</h4>
              <p>Found a bug or have a suggestion? I'd love to hear it.</p>
              <FeedbackForm />
            </div>
            <div className="improve-item">
              <h4 className="about-card__heading">Support the project</h4>
              <p>If DustReady has been useful to you and you'd like to toss a few dollars my way, I'd be incredibly grateful.</p>
              <a href="https://ko-fi.com/jellycatcode" target="_blank" rel="noopener noreferrer" className="kofi-btn">Support on Ko-fi</a>
            </div>
          </div>
        </AccordionSection>

      </div>
    </div>
  )
}

export default AboutPage
