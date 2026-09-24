import { EASE_POINTS } from '../../../lib/linearEases'
import { easeAt } from '../../../lib/easeAt'
import type { AnimationImpl } from '../../../lib/types'

export const run: AnimationImpl = (el, o) => {
  // #region body
  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const randChar = () => CHARS[Math.floor(Math.random() * CHARS.length)]
  const text = el.textContent ?? ''
  const chars = [...text]
  const points = EASE_POINTS[o.ease] ?? [0, 1]
  const revealDelay = 0.2
  const durationMs = o.duration * 1000
  let raf = 0
  let start: number | null = null // @emit: let start = null
  let running = false

  const tick = (now: number) => { // @emit: const tick = (now) => {
    if (!running) return
    if (start === null) start = now
    const elapsed = now - start
    const t = Math.min(1, elapsed / durationMs)
    const progress = easeAt(points, t)
    const revealT = Math.max(0, (progress - revealDelay) / (1 - revealDelay))
    const revealCount = Math.floor(revealT * chars.length)
    el.textContent = chars.map((c, i) => (i < revealCount || c === ' ' ? c : randChar())).join('')
    if (t < 1) {
      raf = requestAnimationFrame(tick)
    } else {
      el.textContent = text
      running = false
    }
  }
  const enter = () => {
    cancelAnimationFrame(raf)
    running = true
    start = null
    raf = requestAnimationFrame(tick)
  }
  const leave = () => {
    running = false
    cancelAnimationFrame(raf)
    el.textContent = text
  }
  const ons = [['pointerenter', enter], ['pointerleave', leave], ['focus', enter], ['blur', leave]] as const
  ons.forEach(([e, fn]) => el.addEventListener(e, fn))
  return () => {
    running = false
    cancelAnimationFrame(raf)
    ons.forEach(([e, fn]) => el.removeEventListener(e, fn))
    el.textContent = text
  }
  // #endregion body
}
