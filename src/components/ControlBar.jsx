import { ACT_CONFIG } from '../utils/actConfig'
import t from '../i18n'

function formatTime(seconds) {
  const s   = Math.floor(seconds)
  const m   = Math.floor(s / 60)
  const rem = s % 60
  return `${m}:${String(rem).padStart(2, '0')}`
}

function PrevIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <polygon points="14,2 4,8 14,14" />
      <rect x="2" y="2" width="2.5" height="12" />
    </svg>
  )
}

function NextIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <polygon points="2,2 12,8 2,14" />
      <rect x="11.5" y="2" width="2.5" height="12" />
    </svg>
  )
}

function PlayIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
      <polygon points="4,2 16,9 4,16" />
    </svg>
  )
}

function PauseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
      <rect x="3" y="2" width="4" height="14" />
      <rect x="11" y="2" width="4" height="14" />
    </svg>
  )
}

function ReplayIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 4v6h6" />
      <path d="M3.51 15a9 9 0 1 0 .49-4.5" />
    </svg>
  )
}

export default function ControlBar({
  activeAct,
  isPlaying,
  isFinished,
  elapsed,
  cumulativeElapsed,
  totalDuration,
  currentActConfig,
  toggle,
  restart,
  nextAct,
  prevAct,
  goToAct,
}) {
  const progressPct = totalDuration > 0 ? (cumulativeElapsed / totalDuration) * 100 : 0

  return (
    <div
      style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        height: 64, zIndex: 50,
        background: 'rgba(10,14,23,0.85)',
        backdropFilter: 'blur(12px)',
        borderTop: '1px solid #1e293b',
        display: 'flex', alignItems: 'center',
        padding: '0 24px', gap: 16,
      }}
    >
      {/* ── LEFT: transport controls ─────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <button
          onClick={prevAct}
          disabled={activeAct === 0}
          style={{
            background: 'none', border: 'none',
            color: activeAct === 0 ? '#374151' : '#e2e8f0',
            cursor: activeAct === 0 ? 'not-allowed' : 'pointer',
            padding: 6, borderRadius: 6,
            display: 'flex', alignItems: 'center',
            transition: 'color 0.15s',
          }}
          onMouseEnter={e => { if (activeAct > 0) e.currentTarget.style.color = '#f97316' }}
          onMouseLeave={e => { e.currentTarget.style.color = activeAct === 0 ? '#374151' : '#e2e8f0' }}
          aria-label={t.controlBar.aria.prev}
        >
          <PrevIcon />
        </button>

        {/* Play / Pause / Replay */}
        <button
          onClick={isFinished ? restart : toggle}
          style={{
            width: 40, height: 40, borderRadius: '50%', border: 'none',
            background: isPlaying ? '#f97316' : '#1e293b',
            color: '#fff', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 0.2s', flexShrink: 0,
          }}
          aria-label={isFinished ? t.controlBar.aria.replay : isPlaying ? t.controlBar.aria.pause : t.controlBar.aria.play}
        >
          {isFinished ? <ReplayIcon /> : isPlaying ? <PauseIcon /> : <PlayIcon />}
        </button>

        <button
          onClick={nextAct}
          disabled={activeAct === ACT_CONFIG.length - 1}
          style={{
            background: 'none', border: 'none',
            color: activeAct === ACT_CONFIG.length - 1 ? '#374151' : '#e2e8f0',
            cursor: activeAct === ACT_CONFIG.length - 1 ? 'not-allowed' : 'pointer',
            padding: 6, borderRadius: 6,
            display: 'flex', alignItems: 'center',
            transition: 'color 0.15s',
          }}
          onMouseEnter={e => { if (activeAct < ACT_CONFIG.length - 1) e.currentTarget.style.color = '#f97316' }}
          onMouseLeave={e => { e.currentTarget.style.color = activeAct === ACT_CONFIG.length - 1 ? '#374151' : '#e2e8f0' }}
          aria-label={t.controlBar.aria.next}
        >
          <NextIcon />
        </button>
      </div>

      {/* ── CENTER: progress scrubber ────────────────────────── */}
      <div style={{ flex: 1, minWidth: 0, position: 'relative', padding: '0 8px' }}>
        <div
          style={{
            position: 'relative', height: 4, borderRadius: 2,
            background: '#1e293b', cursor: 'pointer',
          }}
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect()
            const pct  = (e.clientX - rect.left) / rect.width
            const targetTime = pct * totalDuration
            let cumulative = 0
            for (let i = 0; i < ACT_CONFIG.length; i++) {
              if (targetTime <= cumulative + ACT_CONFIG[i].duration) { goToAct(i); return }
              cumulative += ACT_CONFIG[i].duration
            }
            goToAct(ACT_CONFIG.length - 1)
          }}
        >
          <div style={{
            position: 'absolute', left: 0, top: 0, height: '100%',
            borderRadius: 2, background: '#f97316',
            width: `${progressPct}%`, transition: 'width 0.1s linear',
          }} />

          {ACT_CONFIG.map((act, i) => {
            const pct = i === 0 ? 0 : (ACT_CONFIG.slice(0, i).reduce((s, a) => s + a.duration, 0) / totalDuration) * 100
            return (
              <div
                key={act.id}
                onClick={(e) => { e.stopPropagation(); goToAct(i) }}
                title={`Act ${i}: ${act.title}`}
                style={{
                  position: 'absolute', left: `${pct}%`,
                  top: -4, width: 2, height: 12,
                  background: i === activeAct ? '#f97316' : '#475569',
                  borderRadius: 1, transform: 'translateX(-50%)',
                  cursor: 'pointer', transition: 'background 0.2s',
                }}
              />
            )
          })}

          <div style={{
            position: 'absolute', left: `${progressPct}%`, top: '50%',
            width: 10, height: 10, borderRadius: '50%',
            background: '#f97316',
            transform: 'translate(-50%, -50%)',
            boxShadow: '0 0 0 2px rgba(249,115,22,0.3)',
            pointerEvents: 'none',
          }} />
        </div>
      </div>

      {/* ── RIGHT: act label + timer ─────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
        <span style={{
          color: isFinished ? '#f97316' : '#e2e8f0',
          fontFamily: '"DM Sans", sans-serif',
          fontWeight: 500, fontSize: 14, whiteSpace: 'nowrap',
        }}>
          {isFinished ? t.controlBar.presentationComplete : t.controlBar.actLabel(activeAct, currentActConfig.title)}
        </span>
        <span style={{
          color: '#94a3b8',
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: 13, whiteSpace: 'nowrap',
        }}>
          {formatTime(cumulativeElapsed)} / {formatTime(totalDuration)}
        </span>
      </div>
    </div>
  )
}
