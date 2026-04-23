import { useState } from 'react'
import { CATEGORY_COLORS } from '../utils/colors'

// Must match TimelineChart.jsx CHART_MARGIN
const CHART_MARGIN = { left: 60, right: 65 }

const YEAR_START = 2013
const YEAR_END   = 2025
const YEAR_SPAN  = YEAR_END - YEAR_START   // 12

const ALL_YEARS  = Array.from({ length: YEAR_SPAN + 1 }, (_, i) => YEAR_START + i)

// Parse the various date string formats to a decimal year
function parseDateToYear(dateStr) {
  if (dateStr.includes('H1')) return parseInt(dateStr) + 0.25   // Jan–Jun midpoint ≈ Apr
  if (dateStr.includes('H2')) return parseInt(dateStr) + 0.75   // Jul–Dec midpoint ≈ Oct
  const parts = dateStr.split('-')
  const y1    = parseInt(parts[0])
  if (parts.length === 1) return y1
  const p2 = parseInt(parts[1])
  if (p2 > 12) return (y1 + p2) / 2          // year range (e.g. "2015-2016")
  return y1 + (p2 - 0.5) / 12                 // year-month (e.g. "2023-05")
}

// x% position within the inner track (0–100)
function yearToXPct(decimalYear) {
  return ((decimalYear - YEAR_START) / YEAR_SPAN) * 100
}

export default function TimelineEvents({ events, activeYear, onYearChange }) {
  const [hoveredIdx, setHoveredIdx] = useState(null)

  const parsed = events.map((ev, i) => ({
    ...ev,
    parsedYear: parseDateToYear(ev.date),
    // Alternate above/below the centre line to reduce visual clutter
    above: i % 2 === 0,
  }))

  return (
    // Outer container: padding matches chart left/right margins → years align
    <div style={{ paddingLeft: CHART_MARGIN.left, paddingRight: CHART_MARGIN.right }}>

      {/* ── Track + dots ─────────────────────────────────────── */}
      <div style={{ position: 'relative', height: '86px' }}>

        {/* Horizontal base line */}
        <div
          style={{
            position: 'absolute',
            left: 0, right: 0,
            top: '50%',
            height: '1px',
            background: '#1e293b',
          }}
        />

        {/* Active-year orange tick */}
        <div
          style={{
            position: 'absolute',
            left: `${yearToXPct(activeYear)}%`,
            top: 0, bottom: 0,
            width: '1px',
            background: '#f97316',
            opacity: 0.55,
            transform: 'translateX(-50%)',
            pointerEvents: 'none',
            transition: 'left 0.15s ease',
          }}
        />

        {/* Event dots */}
        {parsed.map((ev, i) => {
          const xPct   = yearToXPct(ev.parsedYear)
          const color  = CATEGORY_COLORS[ev.category] ?? '#94a3b8'
          const size   = ev.impact === 'high' ? 12 : 8
          const radius = size / 2
          // Vertical offset: above or below centre line
          const dotY   = ev.above
            ? `calc(50% - ${radius + 10}px)`
            : `calc(50% + 10px)`

          return (
            <div
              key={i}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
              style={{
                position:    'absolute',
                left:        `${xPct}%`,
                top:         dotY,
                width:       size,
                height:      size,
                borderRadius:'50%',
                background:   color,
                boxShadow:   `0 0 7px ${color}90`,
                transform:   `translateX(-50%)`,
                cursor:      'pointer',
                zIndex:      hoveredIdx === i ? 10 : 2,
                transition:  'transform 0.1s, box-shadow 0.1s',
                ...(hoveredIdx === i && {
                  transform: 'translateX(-50%) scale(1.4)',
                  boxShadow: `0 0 12px ${color}`,
                }),
              }}
            />
          )
        })}

        {/* Hover tooltip — rendered above the whole track */}
        {hoveredIdx !== null && (() => {
          const ev    = parsed[hoveredIdx]
          const xPct  = yearToXPct(ev.parsedYear)
          const color = CATEGORY_COLORS[ev.category] ?? '#94a3b8'
          // Clamp tooltip so it doesn't overflow left/right
          const clampedLeft = Math.min(Math.max(xPct, 10), 75)

          return (
            <div
              style={{
                position:   'absolute',
                left:       `${clampedLeft}%`,
                bottom:     'calc(100% + 4px)',
                transform:  'translateX(-50%)',
                background: 'rgba(10,14,23,0.97)',
                border:     `1px solid ${color}50`,
                borderLeft: `3px solid ${color}`,
                borderRadius:'6px',
                padding:    '10px 14px',
                width:      '260px',
                zIndex:     30,
                pointerEvents:'none',
                boxShadow:  '0 8px 24px rgba(0,0,0,0.7)',
              }}
            >
              <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '10px', color, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>
                {ev.date}&nbsp;&nbsp;·&nbsp;&nbsp;{ev.category.replace(/_/g, ' ')}
              </div>
              <div style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '12px', color: '#e2e8f0', lineHeight: 1.55 }}>
                {ev.event}
              </div>
              {ev.impact === 'high' && (
                <div style={{ marginTop: '6px', fontFamily: '"JetBrains Mono", monospace', fontSize: '10px', color: '#eab308' }}>
                  ⚡ HIGH IMPACT
                </div>
              )}
            </div>
          )
        })()}
      </div>

      {/* ── Year tick labels (clickable) ─────────────────────── */}
      <div style={{ position: 'relative', height: '24px', marginTop: '4px' }}>
        {ALL_YEARS.map(y => (
          <button
            key={y}
            onClick={() => onYearChange(y)}
            style={{
              position:    'absolute',
              left:        `${yearToXPct(y)}%`,
              top:         0,
              transform:   'translateX(-50%)',
              fontFamily:  '"JetBrains Mono", monospace',
              fontSize:    '10px',
              color:        y === activeYear ? '#f97316' : '#374151',
              fontWeight:   y === activeYear ? 700 : 400,
              background:   'none',
              border:       'none',
              cursor:       'pointer',
              padding:      '0 1px',
              transition:   'color 0.15s',
              whiteSpace:   'nowrap',
            }}
          >
            {y}
          </button>
        ))}
      </div>

      {/* ── Category legend ──────────────────────────────────── */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 16px', marginTop: '16px' }}>
        {Object.entries(CATEGORY_COLORS).map(([cat, color]) => (
          <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: color, boxShadow: `0 0 5px ${color}80` }} />
            <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '11px', color: '#475569' }}>
              {cat.replace(/_/g, ' ')}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
