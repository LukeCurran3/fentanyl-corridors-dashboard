import { motion } from 'framer-motion'
import t from '../i18n'

const MONO = '"JetBrains Mono", "Fira Code", "Cascadia Code", monospace'
const ORANGE = '#F97316'

export default function EndCard({ onReplay }) {
  const s = t.endCard
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -60%)',
        zIndex: 30,
        width: 'min(480px, calc(100vw - 64px))',
        textAlign: 'center',
        pointerEvents: 'auto',
      }}
    >
      <div style={{
        background: 'rgba(17,24,39,0.97)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(30,41,59,0.9)',
        borderRadius: 20,
        padding: '40px 36px',
        boxShadow: '0 24px 64px rgba(0,0,0,0.7)',
      }}>
        <p style={{
          fontSize: 10,
          letterSpacing: '0.3em',
          color: ORANGE,
          fontFamily: MONO,
          textTransform: 'uppercase',
          margin: '0 0 14px',
        }}>
          {s.label}
        </p>

        <h2 style={{
          fontSize: 26,
          fontWeight: 700,
          color: 'white',
          margin: '0 0 28px',
          letterSpacing: '-0.01em',
        }}>
          {s.title}
        </h2>

        <div style={{
          borderTop: '1px solid #1e293b',
          borderBottom: '1px solid #1e293b',
          padding: '16px 0',
          margin: '0 0 28px',
        }}>
          <p style={{ fontSize: 12, color: '#475569', margin: '0 0 5px', lineHeight: 1.6 }}>
            {s.sources}
          </p>
          <p style={{ fontSize: 12, color: '#475569', margin: '0 0 5px', lineHeight: 1.6 }}>
            {s.builder}
          </p>
          <p style={{ fontSize: 12, color: '#475569', margin: 0, lineHeight: 1.6 }}>
            {s.report}
          </p>
        </div>

        <motion.button
          onClick={onReplay}
          whileHover={{ opacity: 0.85 }}
          whileTap={{ scale: 0.97 }}
          style={{
            padding: '12px 36px',
            borderRadius: 10,
            border: 'none',
            background: ORANGE,
            color: 'white',
            fontFamily: MONO,
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: '0.08em',
            cursor: 'pointer',
            textTransform: 'uppercase',
          }}
        >
          {s.replay}
        </motion.button>
      </div>
    </motion.div>
  )
}
