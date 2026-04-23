import t from '../i18n'

const COLORS = ['#EF4444', '#F97316', '#EAB308', '#14B8A6', '#3B82F6']

export default function MapLegend() {
  const s = t.mapLegend
  return (
    <div
      style={{
        position: 'absolute',
        bottom: '28px',
        left: '24px',
        zIndex: 10,
        background: 'rgba(10, 14, 23, 0.86)',
        border: '1px solid rgba(30, 41, 59, 0.7)',
        borderRadius: '8px',
        padding: '12px 16px',
        backdropFilter: 'blur(10px)',
        fontFamily: '"DM Sans", sans-serif',
        minWidth: '200px',
      }}
    >
      <p
        style={{
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: '9px',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: '#475569',
          marginBottom: '10px',
        }}
      >
        {s.heading}
      </p>

      {s.items.map(({ label, city }, i) => (
        <div
          key={label}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '8px',
          }}
        >
          <div
            style={{
              width: '9px',
              height: '9px',
              borderRadius: '50%',
              background: COLORS[i],
              boxShadow: `0 0 7px ${COLORS[i]}80`,
              flexShrink: 0,
            }}
          />
          <div style={{ display: 'flex', gap: '6px', alignItems: 'baseline' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#cbd5e1' }}>
              {label}
            </span>
            <span style={{ fontSize: '10px', color: '#475569' }}>
              {city}
            </span>
          </div>
        </div>
      ))}

      {/* Arc width note */}
      <div style={{ borderTop: '1px solid #1e293b', marginTop: '8px', paddingTop: '8px' }}>
        <p style={{ fontSize: '9px', color: '#475569', lineHeight: 1.5, fontFamily: '"JetBrains Mono", monospace' }}>
          {s.arcNote}
        </p>
      </div>
    </div>
  )
}
