import { EASE_POINTS } from '../../../lib/linearEases'
import { easeAt } from '../../../lib/easeAt'
import type { AnimationImpl } from '../../../lib/types'

export const run: AnimationImpl = (el, o, onComplete) => {
  // #region body
  const raw = el.textContent ?? ''
  const match = raw.match(/[\d,]*\d/)
  if (!match) {
    onComplete?.() // @internal
    return () => {}
  }
  const idx = match.index ?? 0
  const prefix = raw.slice(0, idx)
  const suffix = raw.slice(idx + match[0].length)
  const target = Number(match[0].replace(/,/g, ''))
  const points = EASE_POINTS[o.ease] ?? [0, 1]
  const durationMs = o.duration * 1000
  const delayMs = o.delay * 1000
  let raf = 0
  let start: number | null = null // @emit: let start = null
  let cancelled = false

  const tick = (now: number) => { // @emit: const tick = (now) => {
    if (cancelled) return
    if (start === null) start = now
    const elapsed = now - start - delayMs
    if (elapsed < 0) {
      raf = requestAnimationFrame(tick)
      return
    }
    const t = Math.min(1, elapsed / durationMs)
    const value = target * easeAt(points, t)
    el.textContent = prefix + Math.round(value).toLocaleString() + suffix
    if (t < 1) {
      raf = requestAnimationFrame(tick)
    } else {
      onComplete?.() // @internal
    }
  }
  raf = requestAnimationFrame(tick)

  return () => {
    cancelled = true
    cancelAnimationFrame(raf)
    el.textContent = raw
  }
  // #endregion body
}
