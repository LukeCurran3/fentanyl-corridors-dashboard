import { useState, useEffect, useRef, useCallback } from 'react'
import { ACT_CONFIG, TOTAL_DURATION } from '../utils/actConfig'

const ACT_START_TIMES = ACT_CONFIG.map((_, i) =>
  ACT_CONFIG.slice(0, i).reduce((sum, a) => sum + a.duration, 0)
)

export function useAutoPlay() {
  const [activeAct,  setActiveAct]  = useState(0)
  const [isPlaying,  setIsPlaying]  = useState(false)
  const [elapsed,    setElapsed]    = useState(0)
  const [hasStarted, setHasStarted] = useState(false)

  const activeActRef  = useRef(0)
  const elapsedRef    = useRef(0)
  const isPlayingRef  = useRef(false)
  const hasStartedRef = useRef(false)
  const intervalRef   = useRef(null)

  const syncRefs = (act, el, playing) => {
    activeActRef.current = act
    elapsedRef.current   = el
    isPlayingRef.current = playing
  }

  // ── Tick ─────────────────────────────────────────────────────
  const tick = useCallback(() => {
    if (!isPlayingRef.current) return

    const act      = activeActRef.current
    const duration = ACT_CONFIG[act].duration
    const next     = elapsedRef.current + 0.1

    if (next >= duration) {
      if (act < ACT_CONFIG.length - 1) {
        const newAct = act + 1
        syncRefs(newAct, 0, true)
        setActiveAct(newAct)
        setElapsed(0)
      } else {
        syncRefs(act, duration, false)
        setElapsed(duration)
        setIsPlaying(false)
      }
    } else {
      elapsedRef.current = next
      setElapsed(next)
    }
  }, [])

  useEffect(() => {
    intervalRef.current = setInterval(tick, 100)
    return () => clearInterval(intervalRef.current)
  }, [tick])

  // ── Helpers ───────────────────────────────────────────────────
  const markStarted = useCallback(() => {
    if (!hasStartedRef.current) {
      hasStartedRef.current = true
      setHasStarted(true)
    }
  }, [])

  // ── Controls ──────────────────────────────────────────────────
  const play = useCallback(() => {
    markStarted()
    isPlayingRef.current = true
    setIsPlaying(true)
  }, [markStarted])

  const pause = useCallback(() => {
    isPlayingRef.current = false
    setIsPlaying(false)
  }, [])

  const toggle = useCallback(() => {
    const next = !isPlayingRef.current
    if (next) markStarted()
    isPlayingRef.current = next
    setIsPlaying(next)
  }, [markStarted])

  const goToAct = useCallback((n) => {
    markStarted()
    const clamped = Math.max(0, Math.min(n, ACT_CONFIG.length - 1))
    syncRefs(clamped, 0, isPlayingRef.current)
    setActiveAct(clamped)
    setElapsed(0)
  }, [markStarted])

  const nextAct = useCallback(() => goToAct(activeActRef.current + 1), [goToAct])
  const prevAct = useCallback(() => goToAct(activeActRef.current - 1), [goToAct])

  // Explicit "start from title card" — same as play
  const start = useCallback(() => play(), [play])

  // Replay from act 0 without showing the title card again
  const restart = useCallback(() => {
    syncRefs(0, 0, true)
    setActiveAct(0)
    setElapsed(0)
    setIsPlaying(true)
  }, [])

  // ── Keyboard shortcuts ────────────────────────────────────────
  useEffect(() => {
    const onKey = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return

      if (e.code === 'Space') {
        e.preventDefault()
        const lastAct  = ACT_CONFIG.length - 1
        const finished = activeActRef.current === lastAct &&
                         !isPlayingRef.current &&
                         elapsedRef.current >= ACT_CONFIG[lastAct].duration - 0.05
        if (finished) restart()
        else toggle()
      } else if (e.code === 'ArrowRight') {
        e.preventDefault()
        nextAct()
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault()
        prevAct()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [toggle, nextAct, prevAct, restart])

  // ── Derived ───────────────────────────────────────────────────
  const lastAct    = ACT_CONFIG.length - 1
  const isFinished = activeAct === lastAct &&
                     !isPlaying &&
                     elapsed >= ACT_CONFIG[lastAct].duration - 0.05

  return {
    activeAct,
    isPlaying,
    elapsed,
    hasStarted,
    isFinished,
    totalDuration:      TOTAL_DURATION,
    cumulativeElapsed:  ACT_START_TIMES[activeAct] + elapsed,
    currentActConfig:   ACT_CONFIG[activeAct],
    start,
    play,
    pause,
    toggle,
    restart,
    nextAct,
    prevAct,
    goToAct,
  }
}
