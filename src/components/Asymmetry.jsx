import { useState, useEffect } from 'react'
import CorridorCard from './CorridorCard'

export default function Asymmetry() {
  const [corridors, setCorridors] = useState([])

  useEffect(() => {
    fetch('/data/corridors.json')
      .then(r => r.json())
      .then(data => setCorridors(data.filter(c => c.us_pair)))
  }, [])

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

      {/* ── Section header ──────────────────────────────────── */}
      <div style={{ marginBottom: '48px' }}>
        <p
          style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: '11px',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: '#f97316',
            marginBottom: '10px',
          }}
        >
          Panel 2
        </p>
        <h2
          style={{
            fontFamily: '"DM Sans", sans-serif',
            fontWeight: 700,
            fontSize: 'clamp(22px, 3vw, 34px)',
            color: '#e2e8f0',
            letterSpacing: '-0.02em',
            marginBottom: '14px',
            lineHeight: 1.15,
          }}
        >
          The Asymmetry: Same Corridor, Different Realities
        </h2>
        <p
          style={{
            fontFamily: '"DM Sans", sans-serif',
            fontSize: '15px',
            color: '#94a3b8',
            maxWidth: '680px',
            lineHeight: 1.65,
          }}
        >
          Criminal governance determines whether fentanyl takes root locally — even when massive
          quantities transit through. The diverging bars below make the paradox visible: a wide{' '}
          <span style={{ color: '#60a5fa' }}>blue bar</span> means high U.S. seizure volume;
          a wide <span style={{ color: '#f97316' }}>colored bar</span> means deep local market
          penetration.
        </p>
      </div>

      {/* ── 2 × 2 responsive card grid ───────────────────────── */}
      {corridors.length > 0 ? (
        <div className="cards-grid">
          {corridors.map(city => (
            <CorridorCard key={city.id} city={city} />
          ))}
        </div>
      ) : (
        /* Loading skeleton */
        <div className="cards-grid">
          {[0, 1, 2, 3].map(i => (
            <div
              key={i}
              className="skeleton-pulse"
              style={{
                background: '#111827',
                border: '1px solid #1e293b',
                borderLeft: '4px solid #1e293b',
                borderRadius: '8px',
                height: '340px',
              }}
            />
          ))}
        </div>
      )}

      {/* ── Methodology footnote ─────────────────────────────── */}
      <p
        style={{
          marginTop: '24px',
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: '10px',
          color: '#374151',
          lineHeight: 1.6,
        }}
      >
        Diverging bar: left = local market penetration index (integrated 95%, restricted 48%,
        sporadic 10%). Right = CBP field office share of all U.S. fentanyl seizures
        (normalized to San Diego 45% = 100% of right axis). Sources: CBP / WOLA; fieldwork.
      </p>
    </div>
  )
}
