import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import StatNumber from './StatNumber'
import t from '../i18n'

const RED = '#EF4444'
const MONO = '"JetBrains Mono", "Fira Code", "Cascadia Code", monospace'

const DEATHS_DATA = [
  { year: 2015, deaths: 9580 },
  { year: 2016, deaths: 19413 },
  { year: 2017, deaths: 28466 },
  { year: 2018, deaths: 31335 },
  { year: 2019, deaths: 36359 },
  { year: 2020, deaths: 56516 },
  { year: 2021, deaths: 70601 },
  { year: 2022, deaths: 73838 },
  { year: 2023, deaths: 72776 },
  { year: 2024, deaths: 48422 },
]

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: 'rgba(17,24,39,0.95)', border: '1px solid #1e293b', borderRadius: 6, padding: '4px 8px', fontSize: 11, color: '#e2e8f0' }}>
      <p style={{ margin: 0, fontFamily: MONO }}>{label}: {payload[0].value.toLocaleString()}</p>
    </div>
  )
}

export default function CrisisCard() {
  const s = t.crisisCard
  return (
    <div
      style={{
        width: 420,
        background: 'rgba(17,24,39,0.92)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(30,41,59,0.8)',
        borderRadius: 16,
        padding: '20px 22px',
        borderLeft: `4px solid ${RED}`,
        boxShadow: '0 8px 32px rgba(0,0,0,0.5), 0 0 40px rgba(239,68,68,0.15)',
        color: 'white',
      }}
    >
      {/* U.S. context: stat + compact chart */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
        <StatNumber value={48422} duration={1500} style={{ fontSize: 20, fontWeight: 700, color: 'white' }} />
        <span style={{ fontSize: 12, color: '#64748b', flex: 1 }}>{s.statDesc}</span>
        <span style={{ fontSize: 12, color: '#22c55e', fontFamily: MONO, whiteSpace: 'nowrap' }}>▼ 27%</span>
      </div>

      <div style={{ background: 'rgba(10,14,23,0.6)', borderRadius: 8, padding: '8px 4px 2px', marginBottom: 18 }}>
        <ResponsiveContainer width="100%" height={100}>
          <AreaChart data={DEATHS_DATA} margin={{ top: 2, right: 6, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="crisisGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={RED} stopOpacity={0.3} />
                <stop offset="95%" stopColor={RED} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="year"
              tick={{ fill: '#475569', fontSize: 10, fontFamily: MONO }}
              axisLine={{ stroke: '#1e293b' }}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine x={2024} stroke="#22c55e" strokeDasharray="4 3" strokeWidth={1.5} />
            <Area type="monotone" dataKey="deaths" stroke={RED} strokeWidth={2} fill="url(#crisisGrad)" dot={false} activeDot={{ r: 3, fill: RED, stroke: 'white', strokeWidth: 1.5 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div style={{ height: 1, background: '#1e293b', marginBottom: 16 }} />

      {/* Hero: Mexico section */}
      <h2 style={{ fontSize: 20, fontWeight: 700, color: 'white', margin: '0 0 14px', lineHeight: 1.35 }}>
        {s.heading}
      </h2>

      {s.points.map((text, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 8 }}>
          <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: RED, flexShrink: 0, marginTop: 6 }} />
          <p style={{ fontSize: 13, color: '#cbd5e1', margin: 0, lineHeight: 1.5 }}>{text}</p>
        </div>
      ))}

      <p style={{ fontSize: 12, color: '#64748b', fontStyle: 'italic', margin: '14px 0 0', lineHeight: 1.6 }}>
        {s.footer}
      </p>
    </div>
  )
}
