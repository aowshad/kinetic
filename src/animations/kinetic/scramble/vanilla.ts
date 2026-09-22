import { EASE_POINTS } from '../../../lib/linearEases'
import { easeAt } from '../../../lib/easeAt'
import type { AnimationImpl } from '../../../lib/types'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const randChar = () => CHARS[Math.floor(Math.random() * CHARS.length)]

export const run: AnimationImpl = (el, o, onComplete) => {
  // #region body
  const text = el.textContent ?? ''
  const chars = [...text]
  const points = EASE_POINTS[o.ease] ?? [0, 1]
  const revealDelay = 0.3
  const durationMs = o.duration * 1000
  const delayMs = o.delay * 1000
  let raf = 0
  let start: number | null = null
  let cancelled = false

  const tick = (now: number) => {
    if (cancelled) return
    if (start === null) start = now
    const elapsed = now - start - delayMs
    if (elapsed < 0) {
      raf = requestAnimationFrame(tick)
      return
    }
    const t = Math.min(1, elapsed / durationMs)
    const progress = easeAt(points, t)
    const revealT = Math.max(0, (progress - revealDelay) / (1 - revealDelay))
    const revealCount = Math.floor(revealT * chars.length)
    el.textContent = chars.map((c, i) => (i < revealCount || c === ' ' ? c : randChar())).join('')
    if (t < 1) {
      raf = requestAnimationFrame(tick)
    } else {
      el.textContent = text
      onComplete?.() // @internal
    }
  }
  raf = requestAnimationFrame(tick)

  return () => {
    cancelled = true
    cancelAnimationFrame(raf)
    el.textContent = text
  }
  // #endregion body
}
