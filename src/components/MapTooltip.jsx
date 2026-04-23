import t from '../i18n'

const STATUS_COLORS = {
  integrated: '#22c55e',
  restricted:  '#eab308',
  sporadic:    '#ef4444',
}

function getHealthStat(city) {
  const h = city.health_impact
  if (h.overdoses_per_day)                return `${h.overdoses_per_day} overdoses / day`
  if (h.overdoses_per_week)               return `${h.overdoses_per_week} overdoses / week`
  if (h.emergencies_per_week)             return `${h.emergencies_per_week} emergencies / week`
  if (h.emergencies_per_month)            return `${h.emergencies_per_month} emergencies / month`
  if (h.cocaine_fentanyl_deaths_may_2025) return `${h.cocaine_fentanyl_deaths_may_2025} polysubstance deaths (May 2025)`
  return t.mapTooltip.dataLimited
}

export default function MapTooltip({ city, x, y }) {
  if (!city) return null

  const s      = t.mapTooltip
  const status = city.fentanyl_market.status
  const color  = city.governance.color
  const left   = x + 18
  const top    = y - 8

  return (
    <div
      style={{
        position: 'absolute',
        left,
        top,
        zIndex: 20,
        pointerEvents: 'none',
        background: 'rgba(10, 14, 23, 0.97)',
        border: `1px solid ${color}50`,
        borderLeft: `3px solid ${color}`,
        borderRadius: '6px',
        padding: '14px 16px',
        minWidth: '230px',
        maxWidth: '270px',
        boxShadow: `0 8px 32px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04)`,
        fontFamily: '"DM Sans", sans-serif',
      }}
    >
      {/* City name */}
      <div style={{ fontSize: '18px', fontWeight: 700, color: '#e2e8f0', letterSpacing: '-0.02em', marginBottom: '6px' }}>
        {city.name}
      </div>

      {/* Governance badge */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '12px' }}>
        <div
          style={{
            width: '8px', height: '8px', borderRadius: '50%',
            background: color, boxShadow: `0 0 8px ${color}90`,
            flexShrink: 0, marginTop: '3px',
          }}
        />
        <span style={{ fontSize: '11px', color: '#94a3b8', lineHeight: 1.4 }}>
          {city.governance.label}
        </span>
      </div>

      {/* Stats grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '10px 12px',
          paddingTop: '10px',
          borderTop: '1px solid #1e293b',
        }}
      >
        {/* Market status */}
        <div>
          <div style={{ fontSize: '9px', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>
            {s.localMarket}
          </div>
          <div style={{ fontSize: '11px', fontWeight: 700, color: STATUS_COLORS[status] ?? '#94a3b8', letterSpacing: '0.05em' }}>
            {s.statusLabels[status] ?? status.toUpperCase()}
          </div>
        </div>

        {/* Price */}
        <div>
          <div style={{ fontSize: '9px', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>
            {s.pricePerDose}
          </div>
          <div
            style={{
              fontSize: '13px', fontWeight: 600,
              color: '#e2e8f0', fontFamily: '"JetBrains Mono", monospace',
            }}
          >
            {city.fentanyl_market.price_per_dose_usd
              ? `$${city.fentanyl_market.price_per_dose_usd}`
              : '—'}
          </div>
        </div>

        {/* Health stat — full width */}
        <div style={{ gridColumn: '1 / -1' }}>
          <div style={{ fontSize: '9px', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>
            {s.healthImpact}
          </div>
          <div style={{ fontSize: '12px', fontWeight: 600, color: '#fca5a5', fontFamily: '"JetBrains Mono", monospace' }}>
            {getHealthStat(city)}
          </div>
        </div>

        {/* U.S. pair seizures if available */}
        {city.us_pair && (
          <div style={{ gridColumn: '1 / -1' }}>
            <div style={{ fontSize: '9px', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>
              {s.cbpSeizures} ({city.us_pair.cbp_field_office})
            </div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#93c5fd', fontFamily: '"JetBrains Mono", monospace' }}>
              {city.us_pair.cbp_field_office === 'San Diego' ? '~45%' :
               city.us_pair.cbp_field_office === 'Tucson'    ? '~40%' :
               city.us_pair.cbp_field_office === 'El Centro' ? '~7%'  :
               city.us_pair.cbp_field_office === 'El Paso'   ? '~4%'  : '—'}
              {' '}{s.ofAllSeized}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
