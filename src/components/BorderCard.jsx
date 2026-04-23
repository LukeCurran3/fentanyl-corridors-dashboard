import StatNumber from './StatNumber'
import t from '../i18n'

const ORANGE = '#F97316'
const MONO = '"JetBrains Mono", "Fira Code", "Cascadia Code", monospace'

const CORRIDORS = [
  { label: 'San Diego (Tijuana)', pct: 45, color: '#F97316' },
  { label: 'Tucson (Nogales)',    pct: 40, color: '#EAB308' },
  { label: 'El Centro (Mexicali)',pct: 7,  color: '#EF4444' },
  { label: 'El Paso (Juárez)', pct: 4, color: '#3B82F6' },
]

function BarRow({ label, pct, color }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
        <span style={{ fontSize: 13, color: 'white', minWidth: 160, flexShrink: 0 }}>{label}</span>
        <div style={{ flex: 1, background: 'rgba(30,41,59,0.6)', borderRadius: 4, height: 24 }}>
          <div
            style={{
              width: `${pct}%`,
              height: '100%',
              background: color,
              borderRadius: 4,
              minWidth: 4,
              transition: 'width 0.8s ease',
            }}
          />
        </div>
        <span style={{ fontSize: 13, color, fontFamily: MONO, minWidth: 38, textAlign: 'right', fontWeight: 600 }}>
          {pct}%
        </span>
      </div>
    </div>
  )
}

export default function BorderCard() {
  const s = t.borderCard
  return (
    <div
      style={{
        maxWidth: 500,
        background: 'rgba(17,24,39,0.92)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(30,41,59,0.8)',
        borderRadius: 16,
        padding: 24,
        borderLeft: `4px solid ${ORANGE}`,
        boxShadow: '0 8px 32px rgba(0,0,0,0.5), 0 0 40px rgba(249,115,22,0.15)',
        color: 'white',
      }}
    >
      {/* Big stat */}
      <StatNumber
        value={90}
        suffix="%"
        duration={1200}
        style={{ fontSize: 80, fontWeight: 700, color: 'white', lineHeight: 1, display: 'block', marginBottom: 4 }}
      />
      <p style={{ fontSize: 18, color: '#94a3b8', margin: '0 0 8px', lineHeight: 1.4 }}>
        {s.statDesc}
      </p>
      <p style={{ fontSize: 14, color: ORANGE, margin: '0 0 20px' }}>
        {s.localNote}
      </p>

      <div style={{ height: 1, background: '#1e293b', marginBottom: 20 }} />

      {/* Bar chart */}
      <p style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#64748b', margin: '0 0 12px' }}>
        {s.chartLabel}
      </p>
      {CORRIDORS.map((c) => (
        <BarRow key={c.label} {...c} />
      ))}

      <p style={{ fontSize: 11, color: '#475569', margin: '14px 0 0', lineHeight: 1.5 }}>
        {s.footer} <span style={{ color: '#94a3b8' }}>{s.footerStat}</span>{s.footerEnd}
      </p>
    </div>
  )
}
