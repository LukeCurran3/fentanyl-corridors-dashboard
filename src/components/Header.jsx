export default function Header() {
  return (
    <header
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        background: 'linear-gradient(to bottom, rgba(10,14,23,0.92) 0%, rgba(10,14,23,0.6) 70%, transparent 100%)',
        padding: '20px 32px 48px',
        pointerEvents: 'none',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', flexWrap: 'wrap' }}>
        {/* Accent bar */}
        <div
          style={{
            width: '3px',
            height: '36px',
            background: '#f97316',
            borderRadius: '2px',
            flexShrink: 0,
            alignSelf: 'center',
          }}
        />
        <div>
          <h1
            style={{
              fontFamily: '"DM Sans", sans-serif',
              fontWeight: 700,
              fontSize: 'clamp(20px, 2.5vw, 30px)',
              color: '#e2e8f0',
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
              margin: 0,
            }}
          >
            Fentanyl Corridors
          </h1>
          <p
            style={{
              fontFamily: '"DM Sans", sans-serif',
              fontWeight: 400,
              fontSize: 'clamp(12px, 1.2vw, 15px)',
              color: '#94a3b8',
              marginTop: '4px',
              letterSpacing: '0.01em',
            }}
          >
            Criminal Governance &amp; Cross-Border Drug Markets in Northern Mexico
          </p>
        </div>
      </div>
    </header>
  )
}
