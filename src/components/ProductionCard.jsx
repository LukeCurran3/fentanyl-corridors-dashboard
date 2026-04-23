import t from '../i18n'

const ORANGE = '#F97316'
const MONO = '"JetBrains Mono", "Fira Code", "Cascadia Code", monospace'

export default function ProductionCard() {
  const s = t.productionCard
  return (
    <div
      style={{
        maxWidth: 380,
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
      <h2 style={{ fontSize: 20, fontWeight: 700, color: 'white', margin: '0 0 4px' }}>
        Sinaloa
      </h2>
      <p style={{ fontSize: 13, color: '#94a3b8', margin: '0 0 16px' }}>
        {s.subheading}
      </p>

      <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.7, margin: '0 0 20px' }}>
        {s.body}
      </p>

      {/* Seizure stat comparison */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginBottom: 20,
          padding: '14px 16px',
          background: 'rgba(26,31,46,0.6)',
          borderRadius: 10,
          border: '1px solid rgba(30,41,59,0.6)',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontFamily: MONO, fontSize: 22, color: 'white', fontWeight: 700, margin: '0 0 2px' }}>
            102 kg
          </p>
          <p style={{ fontSize: 11, color: '#64748b', margin: 0, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {s.seizedLabel} 2017
          </p>
        </div>

        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="40" height="16" viewBox="0 0 40 16" fill="none">
            <line x1="0" y1="8" x2="30" y2="8" stroke={ORANGE} strokeWidth="2" />
            <polygon points="28,4 40,8 28,12" fill={ORANGE} />
          </svg>
        </div>

        <div style={{ textAlign: 'center' }}>
          <p style={{ fontFamily: MONO, fontSize: 22, color: ORANGE, fontWeight: 700, margin: '0 0 2px' }}>
            2,838 kg
          </p>
          <p style={{ fontSize: 11, color: '#64748b', margin: 0, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {s.seizedLabel} 2024
          </p>
        </div>
      </div>

      {/* Callout */}
      <div
        style={{
          background: 'rgba(26,31,46,0.8)',
          borderLeft: `3px solid ${ORANGE}`,
          padding: '12px 16px',
          borderRadius: 8,
        }}
      >
        <p style={{ fontSize: 13, color: 'white', margin: 0, lineHeight: 1.6, fontStyle: 'italic' }}>
          {s.callout}{' '}
          <span style={{ color: ORANGE, fontWeight: 600 }}>{s.calloutHigh}</span> {s.calloutEnd}
        </p>
      </div>
    </div>
  )
}
