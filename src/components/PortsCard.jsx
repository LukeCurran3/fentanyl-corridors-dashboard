import t from '../i18n'

const CYAN = '#06B6D4'

export default function PortsCard() {
  const s = t.portsCard
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
        borderLeft: `4px solid ${CYAN}`,
        boxShadow: '0 8px 32px rgba(0,0,0,0.5), 0 0 40px rgba(6,182,212,0.15)',
        color: 'white',
      }}
    >
      <h2 style={{ fontSize: 20, fontWeight: 700, color: 'white', margin: '0 0 4px' }}>
        {s.heading}
      </h2>
      <p style={{ fontSize: 13, color: '#94a3b8', margin: '0 0 16px' }}>
        {s.subheading}
      </p>

      <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.7, margin: '0 0 16px' }}>
        {s.body}{' '}
        <span style={{ color: '#e2e8f0', fontWeight: 500 }}>{s.portA}</span> and{' '}
        <span style={{ color: '#e2e8f0', fontWeight: 500 }}>{s.portB}</span>
        {s.bodyEnd}
      </p>

      <div
        style={{
          background: 'rgba(26,31,46,0.8)',
          borderLeft: `3px solid ${CYAN}`,
          padding: '12px 16px',
          borderRadius: 8,
          marginBottom: 16,
        }}
      >
        <p style={{ fontSize: 13, color: 'white', margin: 0, lineHeight: 1.6 }}>
          <span style={{ color: CYAN, fontWeight: 600 }}>{s.keyLabel}</span>
          {s.substances}{' '}
          <span style={{ color: '#e2e8f0', fontWeight: 500 }}>{s.seizureDate}</span>
        </p>
      </div>

      <p style={{ fontSize: 11, color: '#475569', margin: 0 }}>
        {s.source}
      </p>
    </div>
  )
}
