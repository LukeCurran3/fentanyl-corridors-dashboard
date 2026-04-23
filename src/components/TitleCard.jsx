import { motion } from 'framer-motion'
import t from '../i18n'

const MONO = '"JetBrains Mono", "Fira Code", "Cascadia Code", monospace'
const ORANGE = '#F97316'

export default function TitleCard({ onPlay }) {
  const s = t.titleCard
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7 }}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 30,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(10,14,23,0.72)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
      }}
    >
      <div style={{ textAlign: 'center', maxWidth: 580, padding: '0 32px' }}>
        <p style={{
          fontSize: 11,
          letterSpacing: '0.3em',
          color: ORANGE,
          fontFamily: MONO,
          textTransform: 'uppercase',
          margin: '0 0 20px',
        }}>
          {s.label}
        </p>

        <h1 style={{
          fontSize: 46,
          fontWeight: 700,
          color: 'white',
          margin: '0 0 16px',
          lineHeight: 1.15,
          letterSpacing: '-0.02em',
        }}>
          {s.title}
        </h1>

        <p style={{
          fontSize: 16,
          color: '#94a3b8',
          margin: '0 0 10px',
          lineHeight: 1.6,
        }}>
          {s.subtitle}
        </p>

        <p style={{
          fontSize: 12,
          color: '#475569',
          margin: '0 0 52px',
          lineHeight: 1.5,
          fontStyle: 'italic',
        }}>
          {s.supplement}
        </p>

        {/* Play button */}
        <motion.button
          onClick={onPlay}
          whileHover={{ scale: 1.08, backgroundColor: 'rgba(249,115,22,0.28)' }}
          whileTap={{ scale: 0.96 }}
          transition={{ duration: 0.15 }}
          style={{
            width: 76,
            height: 76,
            borderRadius: '50%',
            border: `2px solid ${ORANGE}`,
            background: 'rgba(249,115,22,0.12)',
            color: ORANGE,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 18px',
          }}
          aria-label={s.aria?.play ?? 'Play'}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="7,3 21,12 7,21" />
          </svg>
        </motion.button>

        <p style={{
          fontSize: 12,
          color: '#475569',
          letterSpacing: '0.06em',
          fontFamily: MONO,
        }}>
          {s.cta}
        </p>
      </div>
    </motion.div>
  )
}
