import { useState } from 'react'

const CBP_PCT = {
  'San Diego':  45,
  'Tucson':     40,
  'El Centro':   7,
  'El Paso':     4,
}

const PENETRATION = {
  integrated: 0.95,
  restricted:  0.48,
  sporadic:    0.10,
}

const STATUS_COLORS = {
  integrated: '#22c55e',
  restricted:  '#eab308',
  sporadic:    '#ef4444',
}

const STATUS_LABELS = {
  integrated: 'INTEGRATED',
  restricted:  'RESTRICTED',
  sporadic:    'SPORADIC',
}

const PARADOX = {
  duopoly: {
    text: '2nd highest U.S. seizure rate — yet local market remains clandestine underground',
  },
  prohibition: {
    text: 'Major trafficking corridor — yet fentanyl is effectively banned locally by cartel decree',
  },
}

function getHealthStat(city) {
  const h = city.health_impact
  if (h.overdoses_per_day)     return { value: h.overdoses_per_day,    unit: 'overdoses / day'     }
  if (h.overdoses_per_week)    return { value: h.overdoses_per_week,   unit: 'overdoses / week'    }
  if (h.emergencies_per_week)  return { value: h.emergencies_per_week, unit: 'emergencies / week'  }
  if (h.emergencies_per_month) return { value: h.emergencies_per_month,unit: 'emergencies / month' }
  return { value: '?', unit: 'data limited' }
}

// ── Diverging bar ───────────────────────────────────────────────────────────────
function DivergingBar({ mxPenetration, cbpPct, govColor }) {
  const leftPct  = mxPenetration * 50
  const rightPct = (cbpPct / 45) * 50

  return (
    <div style={{ margin: '18px 0 14px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
        <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '9px', letterSpacing: '0.1em', color: '#475569' }}>
          ◄ MX MARKET PENETRATION
        </span>
        <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '9px', letterSpacing: '0.1em', color: '#475569' }}>
          US CBP SEIZURE SHARE ►
        </span>
      </div>

      <div style={{ position: 'relative', height: '28px', background: '#0a0e17', borderRadius: '4px', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', right: '50%', top: '3px', bottom: '3px',
          width: `${leftPct}%`, background: govColor, opacity: 0.85,
          borderRadius: '3px 0 0 3px',
        }} />
        <div style={{
          position: 'absolute', left: '50%', top: '3px', bottom: '3px',
          width: `${rightPct}%`, background: '#60a5fa', opacity: 0.75,
          borderRadius: '0 3px 3px 0',
        }} />
        <div style={{
          position: 'absolute', left: '50%', top: 0, bottom: 0,
          width: '1px', background: '#1e293b', transform: 'translateX(-50%)',
        }} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
        <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '10px', color: govColor }}>
          {Math.round(mxPenetration * 100)}%
        </span>
        <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '10px', color: '#60a5fa' }}>
          {cbpPct}%
        </span>
      </div>
    </div>
  )
}

// ── Stat box ────────────────────────────────────────────────────────────────────
function Stat({ label, value, unit, valueColor = '#e2e8f0', mono = false }) {
  return (
    <div style={{ marginBottom: '12px' }}>
      <div style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '10px', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '3px' }}>
        {label}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '5px', flexWrap: 'wrap' }}>
        <span style={{
          fontFamily: mono ? '"JetBrains Mono", monospace' : '"DM Sans", sans-serif',
          fontSize: '20px', fontWeight: 700, color: valueColor,
          letterSpacing: '-0.02em', lineHeight: 1,
        }}>
          {value}
        </span>
        {unit && (
          <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '11px', color: '#64748b' }}>
            {unit}
          </span>
        )}
      </div>
    </div>
  )
}

// ── Main card ───────────────────────────────────────────────────────────────────
export default function CorridorCard({ city }) {
  const [isHovered, setIsHovered] = useState(false)

  const color       = city.governance.color
  const govType     = city.governance.type
  const status      = city.fentanyl_market.status
  const cbpPct      = CBP_PCT[city.us_pair.cbp_field_office] ?? 0
  const penetration = PENETRATION[status] ?? 0.1
  const healthStat  = getHealthStat(city)
  const paradox     = PARADOX[govType]
  const hasSemefo   = city.health_impact.semefo_fentanyl_positive_pct != null

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: '#111827',
        border: '1px solid #1e293b',
        borderLeft: `4px solid ${color}`,
        borderRadius: '8px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        // Hover: lift + governance-colored glow ring
        transform:  isHovered ? 'translateY(-3px)' : 'translateY(0)',
        boxShadow:  isHovered
          ? `0 0 0 1px ${color}40, 0 16px 48px rgba(0,0,0,0.6), 0 0 32px ${color}18, inset 0 1px 0 rgba(255,255,255,0.03)`
          : `0 0 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.03)`,
        transition: 'transform 0.22s ease, box-shadow 0.22s ease',
      }}
    >
      {/* ── Header ──────────────────────────────────────────── */}
      <div style={{
        padding: '16px 20px 14px',
        borderBottom: '1px solid #1e293b',
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap',
      }}>
        <div>
          <h3 style={{
            fontFamily: '"DM Sans", sans-serif', fontWeight: 700,
            fontSize: '16px', color: '#e2e8f0', letterSpacing: '-0.01em', marginBottom: '3px',
          }}>
            {city.name} ↔ {city.us_pair.name}
          </h3>
          <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '11px', color: '#64748b' }}>
            {city.state}&nbsp;/&nbsp;{city.us_pair.state}
          </span>
        </div>

        <span style={{
          background: `${color}18`, color, border: `1px solid ${color}35`,
          padding: '4px 10px', borderRadius: '99px',
          fontSize: '10px', fontWeight: 700, letterSpacing: '0.06em',
          textTransform: 'uppercase', fontFamily: '"JetBrains Mono", monospace',
          whiteSpace: 'nowrap', boxShadow: `0 0 10px ${color}20`,
        }}>
          {govType.replace(/_/g, ' ')}
        </span>
      </div>

      {/* ── Diverging bar ───────────────────────────────────── */}
      <div style={{ padding: '0 20px' }}>
        <DivergingBar mxPenetration={penetration} cbpPct={cbpPct} govColor={color} />
      </div>

      {/* ── Two-column stats ────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', flex: 1 }}>

        {/* Mexico */}
        <div style={{ padding: '16px 20px', borderRight: '1px solid #1e293b' }}>
          <div style={{
            fontFamily: '"JetBrains Mono", monospace', fontSize: '9px',
            letterSpacing: '0.14em', textTransform: 'uppercase', color: '#475569',
            marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px',
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: color, display: 'inline-block' }} />
            México
          </div>

          <div style={{ marginBottom: '12px' }}>
            <div style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '10px', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '3px' }}>
              Local Market
            </div>
            <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '12px', fontWeight: 700, color: STATUS_COLORS[status], letterSpacing: '0.08em' }}>
              {STATUS_LABELS[status]}
            </span>
          </div>

          <Stat
            label="Price / dose"
            value={city.fentanyl_market.price_per_dose_usd ? `$${city.fentanyl_market.price_per_dose_usd.toFixed(2)}` : '—'}
            unit="USD"
            valueColor={city.fentanyl_market.price_per_dose_usd >= 10 ? '#fca5a5' : city.fentanyl_market.price_per_dose_usd ? '#e2e8f0' : '#64748b'}
            mono
          />
          <Stat label="Health impact" value={healthStat.value} unit={healthStat.unit} valueColor="#fca5a5" mono />

          {hasSemefo ? (
            <Stat label="SEMEFO fentanyl+" value={`${city.health_impact.semefo_fentanyl_positive_pct}%`} unit="of autopsies" valueColor="#fb923c" mono />
          ) : (
            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '10px', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '3px' }}>
                Forensic testing
              </div>
              <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '12px', color: '#ef4444', fontWeight: 700 }}>NONE</span>
            </div>
          )}
        </div>

        {/* United States */}
        <div style={{ padding: '16px 20px' }}>
          <div style={{
            fontFamily: '"JetBrains Mono", monospace', fontSize: '9px',
            letterSpacing: '0.14em', textTransform: 'uppercase', color: '#475569',
            marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px',
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#60a5fa', display: 'inline-block' }} />
            United States
          </div>

          <div style={{ marginBottom: '14px' }}>
            <div style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '10px', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '3px' }}>
              CBP Seizure Share
            </div>
            <span style={{
              fontFamily: '"JetBrains Mono", monospace', fontSize: '32px', fontWeight: 700,
              color: cbpPct >= 40 ? '#93c5fd' : cbpPct >= 20 ? '#7dd3fc' : '#64748b',
              letterSpacing: '-0.03em', lineHeight: 1,
            }}>
              {cbpPct}%
            </span>
            <div style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '11px', color: '#475569', marginTop: '3px' }}>
              of all U.S. fentanyl seized<br />
              <span style={{ color: '#374151' }}>{city.us_pair.cbp_field_office} Field Office</span>
            </div>
          </div>

          <div style={{ marginBottom: '12px' }}>
            <div style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '10px', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '3px' }}>
              Rank
            </div>
            <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '12px', fontWeight: 700, color: cbpPct >= 40 ? '#93c5fd' : '#64748b' }}>
              {cbpPct === 45 ? '#1 corridor' : cbpPct === 40 ? '#2 corridor' : cbpPct === 7 ? '#3 corridor' : '#4 corridor'}
            </span>
          </div>

          <div>
            <div style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '10px', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '3px' }}>
              Paired city
            </div>
            <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '13px', color: '#94a3b8' }}>
              {city.us_pair.name}
            </span>
            <br />
            <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '11px', color: '#374151' }}>
              {city.us_pair.county}, {city.us_pair.state}
            </span>
          </div>
        </div>
      </div>

      {/* ── Paradox callout ─────────────────────────────────── */}
      {paradox && (
        <div style={{
          margin: '0 20px 16px',
          padding: '10px 14px',
          background: 'rgba(234, 179, 8, 0.06)',
          border: '1px solid rgba(234, 179, 8, 0.2)',
          borderRadius: '6px',
          display: 'flex', gap: '10px', alignItems: 'flex-start',
        }}>
          <span style={{ fontSize: '14px', flexShrink: 0, marginTop: '1px' }}>⚡</span>
          <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '12px', color: '#fde68a', lineHeight: 1.5, margin: 0 }}>
            {paradox.text}
          </p>
        </div>
      )}
    </div>
  )
}
