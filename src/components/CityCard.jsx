import { motion } from 'framer-motion'
import t from '../i18n'

const MONO = '"JetBrains Mono", "Fira Code", "Cascadia Code", monospace'

function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
}

const headerVariants = {
  hidden: { opacity: 0, x: -20 },
  show:   { opacity: 1, x: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

const rowVariants = {
  hidden: { opacity: 0, x: -28 },
  show:   { opacity: 1, x: 0, transition: { duration: 0.45, ease: 'easeOut' } },
}

function BulletRow({ label, govColor, children }) {
  return (
    <motion.div
      variants={rowVariants}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 14,
        padding: '10px 0',
        borderBottom: '1px solid rgba(30,41,59,0.5)',
      }}
    >
      <span style={{
        display: 'block',
        width: 4,
        height: 4,
        borderRadius: '50%',
        background: govColor,
        flexShrink: 0,
        marginTop: 7,
      }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          fontSize: 10,
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          color: '#475569',
          margin: '0 0 3px',
          fontWeight: 600,
        }}>
          {label}
        </p>
        {children}
      </div>
    </motion.div>
  )
}

export default function CityCard({ cityData }) {
  const { id, name, state, governance, fentanyl_market, health_impact } = cityData
  const s        = t.cityCard
  const cityI18n = t.cityData[id] ?? {}
  const govColor   = governance.color
  const regulation = s.regulation[governance.type] || governance.type.replace('_', ' ')
  const groups     = cityI18n.groups   ?? governance.groups
  const formats    = cityI18n.formats  ?? fentanyl_market.formats
  const overdose   = cityI18n.overdose_display ?? health_impact.overdose_display

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      style={{
        maxWidth: 360,
        background: 'rgba(17,24,39,0.92)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(30,41,59,0.8)',
        borderRadius: 16,
        padding: '20px 22px 14px',
        borderLeft: `4px solid ${govColor}`,
        boxShadow: `0 8px 32px rgba(0,0,0,0.5), 0 0 40px ${hexToRgba(govColor, 0.15)}`,
      }}
    >
      {/* Header */}
      <motion.div variants={headerVariants} style={{ marginBottom: 14 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: 'white', margin: '0 0 2px', lineHeight: 1.2 }}>
          {name}
        </h2>
        <span style={{ fontSize: 12, color: '#64748b', letterSpacing: '0.04em' }}>{state}</span>
      </motion.div>

      {/* Row 1 — Territory */}
      <BulletRow label={s.territory} govColor={govColor}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {groups.map((g, i) => (
            <span key={i} style={{ fontSize: 13, color: '#e2e8f0', lineHeight: 1.5 }}>{g}</span>
          ))}
        </div>
      </BulletRow>

      {/* Row 2 — Regulation */}
      <BulletRow label={s.regulationStyle} govColor={govColor}>
        <span style={{ fontSize: 15, fontWeight: 600, color: govColor, letterSpacing: '0.01em' }}>
          {regulation}
        </span>
      </BulletRow>

      {/* Row 3 — Forms */}
      <BulletRow label={s.forms} govColor={govColor}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {formats.map((f, i) => (
            <span key={i} style={{ fontSize: 13, color: '#e2e8f0', lineHeight: 1.5 }}>{f}</span>
          ))}
        </div>
      </BulletRow>

      {/* Row 4 — Price */}
      <BulletRow label={s.pricePerDose} govColor={govColor}>
        <span style={{ fontFamily: MONO, fontSize: 18, fontWeight: 600, color: 'white' }}>
          ${fentanyl_market.price_per_dose_usd}/dose
        </span>
      </BulletRow>

      {/* Row 5 — Health toll */}
      <BulletRow label={s.healthToll} govColor={govColor}>
        <span style={{ fontFamily: MONO, fontSize: 17, fontWeight: 600, color: 'white' }}>
          {overdose}
        </span>
      </BulletRow>
    </motion.div>
  )
}
