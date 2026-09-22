import { EASE_POINTS } from '../../../lib/linearEases'
import { easeAt } from '../../../lib/easeAt'
import type { AnimationImpl } from '../../../lib/types'

export const run: AnimationImpl = (el, o, onComplete) => {
  // #region body
  const text = el.textContent ?? ''
  el.textContent = ''
  el.classList.add('k-type-caret')
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
    const count = Math.round(easeAt(points, t) * text.length)
    el.textContent = text.slice(0, count)
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
    el.classList.remove('k-type-caret')
    el.textContent = text
  }
  // #endregion body
}
