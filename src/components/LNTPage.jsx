import './LNTPage.css'

const PRINCIPLES = [
  {
    number: '01',
    title: 'Plan Ahead and Prepare',
    summary: 'Good LNT starts before you leave home.',
    tips: [
      'Know the event's rules and designated camping/parking areas before you arrive.',
      'Pack out what you pack in — bring bags specifically for your trash and recycling.',
      'Repackage food to minimize waste before you go. Less packaging = less MOOP.',
      'Have a plan for every container, wrapper, and bottle you bring.',
    ],
  },
  {
    number: '02',
    title: 'Travel and Camp on Durable Surfaces',
    summary: 'Stick to designated areas and leave the land as you found it.',
    tips: [
      'Camp only in assigned spots. Don't expand your footprint into undesignated areas.',
      'Use established pathways between camp and event spaces.',
      'Avoid trampling vegetation — it takes years to recover.',
      'At burns and large events: your camp footprint ends where it started.',
    ],
  },
  {
    number: '03',
    title: 'Dispose of Waste Properly',
    summary: 'Pack it in, pack it out. Every single thing.',
    tips: [
      'MOOP (Matter Out Of Place) is anything that wasn't there before you arrived — pick it up, even if it's not yours.',
      'Do a thorough MOOP sweep of your entire camp before leaving.',
      'Never pour gray water, food scraps, or liquids onto the ground.',
      'Bag and pack out all food waste, cigarette butts, glitter, feathers, and confetti.',
      'Use designated dump stations for gray water and port-a-potties for everything else.',
    ],
  },
  {
    number: '04',
    title: 'Leave What You Find',
    summary: 'Take only memories (and your art). Leave the land unchanged.',
    tips: [
      'Don't dig trenches, build permanent structures, or alter the landscape.',
      'Leave rocks, plants, and natural features exactly where they are.',
      'At burns: leave no trace means the land looks the same as — or better than — when you arrived.',
    ],
  },
  {
    number: '05',
    title: 'Minimize Fire and Fuel Impact',
    summary: 'Fire is a privilege. Treat it that way.',
    tips: [
      'Use established fire rings or event-provided burn barrels. Never burn on bare ground.',
      'Burn only clean wood — no pallets with nails, painted wood, or trash.',
      'Never leave a fire unattended. Fully extinguish before sleeping or leaving camp.',
      'Collect ashes and cooled coals and pack them out in a sealed container.',
      'Check fire restrictions before the event — conditions change.',
    ],
  },
  {
    number: '06',
    title: 'Respect Wildlife',
    summary: 'You're a guest in their home.',
    tips: [
      'Store all food securely — never leave it out unattended.',
      'Don't feed animals, even small ones. Human food harms them.',
      'Keep noise at reasonable levels in and around natural areas.',
      'If you see wildlife, observe from a distance. Don't approach or follow.',
    ],
  },
  {
    number: '07',
    title: 'Be Considerate of Others',
    summary: 'The experience you create affects everyone around you.',
    tips: [
      'Keep sound contained to your camp during quiet hours.',
      'Be mindful of light pollution — point lights down, not into neighboring camps or the sky.',
      'Yield to others on paths and in shared spaces.',
      'Leave your neighbors' camp as pristine as you'd want yours left.',
      'Radical self-reliance starts with not making your mess someone else's problem.',
    ],
  },
]

function LNTPage() {
  return (
    <div className="lnt-page">
      <div className="lnt-header">
        <h2>Leave No Trace</h2>
        <p>Seven principles for being a responsible guest — at festivals, burns, and beyond.</p>
      </div>

      <div className="lnt-principles">
        {PRINCIPLES.map(p => (
          <article key={p.number} className="lnt-card">
            <div className="lnt-card__header">
              <span className="lnt-number">{p.number}</span>
              <div>
                <h3 className="lnt-title">{p.title}</h3>
                <p className="lnt-summary">{p.summary}</p>
              </div>
            </div>
            <ul className="lnt-tips">
              {p.tips.map((tip, i) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <p className="lnt-footer">
        Based on the <strong>Leave No Trace Seven Principles</strong> — adapted for festival and burn communities.
      </p>
    </div>
  )
}

export default LNTPage
