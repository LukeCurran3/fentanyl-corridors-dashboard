import { useState, useEffect, useMemo } from 'react'
import TimelineChart from './TimelineChart'
import TimelineEvents from './TimelineEvents'

const SISVEA_PEAK = 922
const US_PEAK     = 73838

// Merge the separate data series into one array of yearly rows for Recharts
function buildChartData(ts) {
  const seizMap = Object.fromEntries(
    ts.mexico_national_fentanyl_seizures_kg.data.map(d => [d.year, d.kg])
  )
  const sisMap  = Object.fromEntries(
    ts.sisvea_fentanyl_treatment_mentions.data.map(d => [d.year, d.count])
  )
  const usMap   = Object.fromEntries(
    ts.us_overdose_deaths_synthetic_opioids.data.map(d => [d.year, d.deaths])
  )

  return Array.from({ length: 13 }, (_, i) => {
    const year = 2013 + i
    const seiz = seizMap[year] ?? null
    const sisv = sisMap[year]  ?? null
    const usD  = usMap[year]   ?? null
    return {
      year,
      mxSeizures:  seiz,
      sisvea:      sisv,
      usDeaths:    usD,
      // Normalized 0–100 for the right Y-axis (so both series fit on one scale)
      sisveaNorm:  sisv != null ? +(sisv / SISVEA_PEAK * 100).toFixed(1) : null,
      usDeathsNorm:usD  != null ? +(usD  / US_PEAK    * 100).toFixed(1) : null,
    }
  })
}

function getStatsForYear(ts, year) {
  const seiz = ts.mexico_national_fentanyl_seizures_kg.data.find(d => d.year === year)
  const sisv = ts.sisvea_fentanyl_treatment_mentions.data.find(d => d.year === year)
  const usD  = ts.us_overdose_deaths_synthetic_opioids.data.find(d => d.year === year)
  return {
    mxSeizures: seiz?.kg     ?? null,
    sisvea:     sisv?.count  ?? null,
    usDeaths:   usD?.deaths  ?? null,
  }
}

// ── Stat pill ──────────────────────────────────────────────────────────────────
function StatPill({ label, value, color = '#e2e8f0', suffix = '' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
      <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '10px', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        {label}
      </span>
      <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '17px', fontWeight: 700, color, letterSpacing: '-0.02em', lineHeight: 1 }}>
        {value != null ? `${value.toLocaleString()}${suffix}` : '—'}
      </span>
    </div>
  )
}

// ── Component ──────────────────────────────────────────────────────────────────
export default function Timeline() {
  const [timeSeries, setTimeSeries] = useState(null)
  const [events,     setEvents]     = useState([])
  const [activeYear, setActiveYear] = useState(2022)

  useEffect(() => {
    Promise.all([
      fetch('/data/time_series.json').then(r => r.json()),
      fetch('/data/timeline_events.json').then(r => r.json()),
    ]).then(([ts, ev]) => {
      setTimeSeries(ts)
      setEvents(ev)
    })
  }, [])

  const chartData  = useMemo(() => timeSeries ? buildChartData(timeSeries) : [], [timeSeries])
  const activeStats= useMemo(() => timeSeries ? getStatsForYear(timeSeries, activeYear) : {}, [timeSeries, activeYear])

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

      {/* ── Section header ──────────────────────────────────── */}
      <div style={{ marginBottom: '40px' }}>
        <p style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#f97316', marginBottom: '10px' }}>
          Panel 3
        </p>
        <h2
          style={{
            fontFamily: '"DM Sans", sans-serif',
            fontWeight: 700,
            fontSize: 'clamp(22px, 3vw, 34px)',
            color: '#e2e8f0',
            letterSpacing: '-0.02em',
            marginBottom: '12px',
            lineHeight: 1.15,
          }}
        >
          The Trajectory of Fentanyl in Mexico&apos;s Northern Border
        </h2>
        <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '15px', color: '#94a3b8', maxWidth: '640px', lineHeight: 1.65 }}>
          From silent introduction to uneven consolidation — hover the chart or click a year to explore the data.
        </p>
      </div>

      {/* ── Chart + events container ─────────────────────────── */}
      <div
        style={{
          background: '#111827',
          border: '1px solid #1e293b',
          borderRadius: '10px',
          padding: '24px 0 20px',
          overflow: 'hidden',
        }}
      >
        {timeSeries ? (
          <>
            <TimelineChart
              chartData={chartData}
              activeYear={activeYear}
              onYearChange={setActiveYear}
            />
            <div style={{ borderTop: '1px solid #1e293b', paddingTop: '20px', marginTop: '8px' }}>
              <TimelineEvents
                events={events}
                activeYear={activeYear}
                onYearChange={setActiveYear}
              />
            </div>
          </>
        ) : (
          <div style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <span className="loading-dot" />
            <span className="loading-dot" />
            <span className="loading-dot" />
          </div>
        )}
      </div>

      {/* ── Active year stats panel ──────────────────────────── */}
      <div
        style={{
          marginTop: '20px',
          background: '#0d1220',
          border: '1px solid #1e293b',
          borderLeft: '3px solid #f97316',
          borderRadius: '6px',
          padding: '18px 24px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '28px 48px',
          alignItems: 'center',
        }}
      >
        {/* Year label */}
        <div>
          <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '10px', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Selected year
          </span>
          <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '32px', fontWeight: 700, color: '#f97316', letterSpacing: '-0.03em', lineHeight: 1 }}>
            {activeYear}
          </div>
        </div>

        {/* Divider */}
        <div style={{ width: '1px', height: '48px', background: '#1e293b', alignSelf: 'center' }} />

        <StatPill
          label="MX fentanyl seized"
          value={activeStats.mxSeizures}
          color="#f97316"
          suffix=" kg"
        />
        <StatPill
          label="SISVEA treatment mentions"
          value={activeStats.sisvea}
          color="#e2e8f0"
        />
        <StatPill
          label="U.S. synthetic OD deaths"
          value={activeStats.usDeaths}
          color="#f87171"
        />

        {/* Contextual note — only after data is loaded */}
        {timeSeries && activeStats.mxSeizures == null && activeStats.sisvea == null && activeStats.usDeaths == null && (
          <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '12px', color: '#374151', marginLeft: 'auto' }}>
            No data available for {activeYear}
          </span>
        )}
      </div>

      {/* ── Source footnote ──────────────────────────────────── */}
      <p style={{ marginTop: '12px', fontFamily: '"JetBrains Mono", monospace', fontSize: '10px', color: '#374151', lineHeight: 1.6 }}>
        Sources: SEDENA / Secretaría de Marina (MX seizures, kg) · SISVEA / CONASAMA (treatment mentions) · CDC WONDER / NCHS (U.S. synthetic opioid deaths) · Chart right axis: normalized to % of series peak (MX peak = 2,838 kg in 2024; SISVEA peak = 922 in 2023; U.S. deaths peak = 73,838 in 2022).
      </p>
    </div>
  )
}
