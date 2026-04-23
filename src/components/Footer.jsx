export default function Footer() {
  return (
    <footer
      style={{
        background: '#111827',
        borderTop: '1px solid #1e293b',
        padding: '48px 32px',
        fontFamily: '"DM Sans", sans-serif',
      }}
    >
      <div style={{ maxWidth: '960px', margin: '0 auto' }}>
        {/* Top row: logo accent + citation */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div
            style={{
              width: '3px',
              minHeight: '48px',
              background: '#f97316',
              borderRadius: '2px',
              flexShrink: 0,
            }}
          />
          <p
            style={{
              color: '#e2e8f0',
              fontSize: '14px',
              lineHeight: 1.65,
              margin: 0,
            }}
          >
            Supplementary visualization for{' '}
            <em style={{ color: '#f97316' }}>
              "Reglas locales, lecciones globales: cómo la gobernanza criminal moldea los mercados
              de fentanilo en el norte de México"
            </em>{' '}
            by InSight Crime (March 2026).
          </p>
        </div>

        {/* Divider */}
        <div style={{ borderTop: '1px solid #1e293b', margin: '0 0 20px' }} />

        {/* Two-column bottom row */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          {/* Data sources */}
          <div>
            <p
              style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '11px',
                color: '#94a3b8',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: '8px',
              }}
            >
              Data Sources
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {[
                'CBP — U.S. Customs and Border Protection seizure data',
                'CDC — U.S. synthetic opioid overdose mortality',
                'INEGI — Instituto Nacional de Estadística y Geografía',
                'SISVEA — Sistema de Vigilancia Epidemiológica de las Adicciones',
                'SEDENA — Secretaría de la Defensa Nacional seizure records',
              ].map((source) => (
                <li
                  key={source}
                  style={{
                    fontSize: '12px',
                    color: '#64748b',
                    lineHeight: 1.7,
                  }}
                >
                  {source}
                </li>
              ))}
            </ul>
          </div>

          {/* Author credit */}
          <div style={{ textAlign: 'right' }}>
            <p
              style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '11px',
                color: '#94a3b8',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: '8px',
              }}
            >
              Dashboard
            </p>
            <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.6 }}>
              Luke Curran
            </p>
            <p style={{ fontSize: '12px', color: '#475569', lineHeight: 1.6 }}>
              Case Western Reserve University
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
