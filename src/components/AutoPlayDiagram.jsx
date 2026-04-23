import { useState, useEffect, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useAutoPlay } from '../hooks/useAutoPlay'
import MapView from './MapView'
import ControlBar from './ControlBar'
import ContentOverlay from './ContentOverlay'
import TitleCard from './TitleCard'
import EndCard from './EndCard'
import t from '../i18n'

const MONO = '"JetBrains Mono", "Fira Code", "Cascadia Code", monospace'

// ── Sub-components ─────────────────────────────────────────────────────────────

function MobileMessage() {
  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: '#0a0e17',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: 32, textAlign: 'center',
    }}>
      <p style={{ color: '#F97316', fontFamily: MONO, fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', margin: '0 0 16px' }}>
        {t.autoPlay.projectLabel}
      </p>
      <p style={{ color: '#e2e8f0', fontSize: 18, fontWeight: 600, margin: '0 0 12px' }}>
        {t.autoPlay.desktopRequired}
      </p>
      <p style={{ color: '#64748b', fontSize: 14, lineHeight: 1.7, maxWidth: 320 }}>
        {t.autoPlay.desktopMessage}
      </p>
    </div>
  )
}

function LoadingOverlay() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: '#0a0e17',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: 16,
      }}
    >
      <motion.div
        animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
        style={{ width: 12, height: 12, borderRadius: '50%', background: '#F97316' }}
      />
      <p style={{ color: '#475569', fontFamily: MONO, fontSize: 12, letterSpacing: '0.12em', margin: 0 }}>
        {t.autoPlay.loading}
      </p>
    </motion.div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function AutoPlayDiagram() {
  const autoPlay = useAutoPlay()
  const [isLoaded, setIsLoaded]       = useState(false)
  const [isTooNarrow, setIsTooNarrow] = useState(window.innerWidth < 1024)

  useEffect(() => {
    const onResize = () => setIsTooNarrow(window.innerWidth < 1024)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const handleReady = useCallback(() => setIsLoaded(true), [])

  if (isTooNarrow) return <MobileMessage />

  return (
    <div style={{
      width: '100vw', height: '100vh',
      position: 'relative', overflow: 'hidden',
      background: '#0a0e17',
    }}>
      {/* z-0: full-viewport map */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <MapView
          activeAct={autoPlay.activeAct}
          hasStarted={autoPlay.hasStarted}
          onReady={handleReady}
        />
      </div>

      {/* z-10: content overlay cards — only render after started */}
      {autoPlay.hasStarted && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 10, pointerEvents: 'none' }}>
          <ContentOverlay
            activeAct={autoPlay.activeAct}
            currentActConfig={autoPlay.currentActConfig}
          />
        </div>
      )}

      {/* z-30: title card (before first play) and end card */}
      <AnimatePresence>
        {isLoaded && !autoPlay.hasStarted && (
          <TitleCard key="title" onPlay={autoPlay.start} />
        )}
        {autoPlay.isFinished && (
          <EndCard key="end" onReplay={autoPlay.restart} />
        )}
      </AnimatePresence>

      {/* z-50: control bar — always visible */}
      <ControlBar
        activeAct={autoPlay.activeAct}
        isPlaying={autoPlay.isPlaying}
        isFinished={autoPlay.isFinished}
        elapsed={autoPlay.elapsed}
        cumulativeElapsed={autoPlay.cumulativeElapsed}
        totalDuration={autoPlay.totalDuration}
        currentActConfig={autoPlay.currentActConfig}
        toggle={autoPlay.toggle}
        restart={autoPlay.restart}
        nextAct={autoPlay.nextAct}
        prevAct={autoPlay.prevAct}
        goToAct={autoPlay.goToAct}
      />

      {/* z-200: loading overlay — covers everything until map + data ready */}
      <AnimatePresence>
        {!isLoaded && <LoadingOverlay key="loading" />}
      </AnimatePresence>
    </div>
  )
}
