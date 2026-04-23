import {
  ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ReferenceLine, ResponsiveContainer,
} from 'recharts'

// Must match TimelineEvents.jsx CHART_MARGIN
export const CHART_MARGIN = { top: 20, right: 65, left: 60, bottom: 5 }

const SISVEA_PEAK  = 922
const US_PEAK      = 73838

// ── Custom tooltip ──────────────────────────────────────────────────────────────
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null

  const byKey = Object.fromEntries(payload.map(p => [p.dataKey, p.payload]))
  const d     = byKey[payload[0]?.dataKey]

  return (
    <div
      style={{
        background: 'rgba(10,14,23,0.97)',
        border: '1px solid #1e293b',
        borderRadius: '6px',
        padding: '12px 16px',
        fontFamily: '"DM Sans", sans-serif',
        minWidth: '200px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
      }}
    >
      <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '13px', color: '#f97316', fontWeight: 700, marginBottom: '10px' }}>
        {label}
      </div>

      {d?.mxSeizures != null && (
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '24px', marginBottom: '6px' }}>
          <span style={{ fontSize: '12px', color: '#94a3b8' }}>MX fentanyl seized</span>
          <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '12px', color: '#f97316', fontWeight: 600 }}>
            {d.mxSeizures.toLocaleString()} kg
          </span>
        </div>
      )}
      {d?.sisvea != null && (
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '24px', marginBottom: '6px' }}>
          <span style={{ fontSize: '12px', color: '#94a3b8' }}>SISVEA mentions</span>
          <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '12px', color: '#e2e8f0', fontWeight: 600 }}>
            {d.sisvea.toLocaleString()}
          </span>
        </div>
      )}
      {d?.usDeaths != null && (
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '24px' }}>
          <span style={{ fontSize: '12px', color: '#94a3b8' }}>U.S. synthetic OD deaths</span>
          <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '12px', color: '#f87171', fontWeight: 600 }}>
            {d.usDeaths.toLocaleString()}
          </span>
        </div>
      )}
    </div>
  )
}

// ── Custom legend ───────────────────────────────────────────────────────────────
function ChartLegend() {
  const items = [
    { color: '#f97316', label: 'MX fentanyl seizures (kg)', type: 'area'  },
    { color: '#e2e8f0', label: 'SISVEA treatment mentions',  type: 'line'  },
    { color: '#f87171', label: 'U.S. synthetic opioid deaths', type: 'dashed' },
  ]
  return (
    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '12px', paddingLeft: CHART_MARGIN.left }}>
      {items.map(({ color, label, type }) => (
        <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
          {type === 'area' && (
            <div style={{ width: '20px', height: '10px', background: `${color}40`, border: `1.5px solid ${color}`, borderRadius: '2px' }} />
          )}
          {type === 'line' && (
            <div style={{ width: '20px', height: '2px', background: color }} />
          )}
          {type === 'dashed' && (
            <div style={{ width: '20px', height: '2px', background: color, borderTop: `2px dashed ${color}` }} />
          )}
          <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '11px', color: '#94a3b8' }}>
            {label}
          </span>
        </div>
      ))}
      <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '10px', color: '#374151', marginLeft: 'auto', alignSelf: 'center', paddingRight: CHART_MARGIN.right }}>
        Right axis: % of series peak
      </span>
    </div>
  )
}

// ── Y-axis tick formatter ───────────────────────────────────────────────────────
const fmtLeft  = v => v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v
const fmtRight = v => `${Math.round(v)}%`

const AXIS_STYLE = {
  fontFamily: '"JetBrains Mono", monospace',
  fontSize:   11,
  fill:       '#475569',
}

// ── Component ──────────────────────────────────────────────────────────────────
export default function TimelineChart({ chartData, activeYear, onYearChange }) {
  return (
    <div>
      <ChartLegend />
      <ResponsiveContainer width="100%" height={280}>
        <ComposedChart
          data={chartData}
          margin={CHART_MARGIN}
          onMouseMove={data => {
            if (data?.activeLabel) onYearChange(Number(data.activeLabel))
          }}
        >
          {/* Grid */}
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.06)"
            vertical={false}
          />

          {/* Axes */}
          <XAxis
            dataKey="year"
            type="number"
            domain={[2013, 2025]}
            ticks={[2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025]}
            tickLine={false}
            axisLine={{ stroke: '#1e293b' }}
            tick={{ ...AXIS_STYLE }}
          />
          <YAxis
            yAxisId="left"
            orientation="left"
            tickFormatter={fmtLeft}
            axisLine={false}
            tickLine={false}
            tick={{ ...AXIS_STYLE }}
            label={{
              value: 'Fentanyl Seized (kg)',
              angle: -90, position: 'insideLeft',
              offset: 10, dy: 55,
              style: { ...AXIS_STYLE, fill: '#f97316', fontSize: 10, letterSpacing: '0.05em' },
            }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            domain={[0, 100]}
            tickFormatter={fmtRight}
            axisLine={false}
            tickLine={false}
            tick={{ ...AXIS_STYLE }}
            label={{
              value: '% of peak',
              angle: 90, position: 'insideRight',
              offset: 10, dy: -25,
              style: { ...AXIS_STYLE, fill: '#475569', fontSize: 10 },
            }}
          />

          {/* Reference line at active year */}
          <ReferenceLine
            yAxisId="left"
            x={activeYear}
            stroke="#f97316"
            strokeOpacity={0.5}
            strokeWidth={1}
            strokeDasharray="4 4"
          />

          {/* Series */}
          <Area
            yAxisId="left"
            dataKey="mxSeizures"
            stroke="#f97316"
            strokeWidth={1.5}
            fill="#f97316"
            fillOpacity={0.15}
            dot={false}
            activeDot={{ r: 4, fill: '#f97316', stroke: '#0a0e17', strokeWidth: 2 }}
            connectNulls={false}
            name="MX Seizures"
          />
          <Line
            yAxisId="right"
            dataKey="sisveaNorm"
            stroke="#e2e8f0"
            strokeWidth={1.5}
            dot={false}
            activeDot={{ r: 4, fill: '#e2e8f0', stroke: '#0a0e17', strokeWidth: 2 }}
            connectNulls={false}
            name="SISVEA"
          />
          <Line
            yAxisId="right"
            dataKey="usDeathsNorm"
            stroke="#f87171"
            strokeWidth={1.5}
            strokeDasharray="5 3"
            dot={false}
            activeDot={{ r: 4, fill: '#f87171', stroke: '#0a0e17', strokeWidth: 2 }}
            connectNulls={false}
            name="US Deaths"
          />

          <Tooltip content={<ChartTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.08)', strokeWidth: 1 }} />
          <Legend content={() => null} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
