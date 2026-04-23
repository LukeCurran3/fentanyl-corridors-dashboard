import { useEffect, useRef, useState } from 'react'

const MONO = '"JetBrains Mono", "Fira Code", "Cascadia Code", monospace'

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3)
}

/**
 * Counts up from 0 to `value` over `duration` ms on mount.
 * prefix/suffix are appended as plain strings (e.g. prefix="$", suffix="%").
 */
export default function StatNumber({
  value,
  suffix = '',
  prefix = '',
  duration = 1000,
  style = {},
}) {
  const [display, setDisplay] = useState(0)
  const rafRef = useRef(null)
  const startRef = useRef(null)

  useEffect(() => {
    startRef.current = null
    if (rafRef.current) cancelAnimationFrame(rafRef.current)

    const step = (ts) => {
      if (!startRef.current) startRef.current = ts
      const progress = Math.min((ts - startRef.current) / duration, 1)
      setDisplay(Math.round(easeOutCubic(progress) * value))
      if (progress < 1) rafRef.current = requestAnimationFrame(step)
    }

    rafRef.current = requestAnimationFrame(step)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [value, duration])

  return (
    <span style={{ fontFamily: MONO, ...style }}>
      {prefix}{display.toLocaleString()}{suffix}
    </span>
  )
}
