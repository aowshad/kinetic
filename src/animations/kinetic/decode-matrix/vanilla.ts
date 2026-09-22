import { splitChars } from '../../../lib/splitChars'
import { EASE_POINTS } from '../../../lib/linearEases'
import { easeAt } from '../../../lib/easeAt'
import type { AnimationImpl } from '../../../lib/types'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const randChar = () => CHARS[Math.floor(Math.random() * CHARS.length)]

export const run: AnimationImpl = (el, o, onComplete) => {
  // #region body
  el.classList.add('k-mono')
  const split = splitChars(el)
  const finals = split.chars.map((c) => c.textContent ?? '')
  const locked = finals.map((f) => f.trim() === '')
  const points = EASE_POINTS[o.ease] ?? [0, 1]
  const revealDelay = 0.1
  const durationMs = o.duration * 1000
  const delayMs = o.delay * 1000
  let raf = 0
  let start: number | null = null // @emit: let start = null
  let cancelled = false

  const tick = (now: number) => { // @emit: const tick = (now) => {
    if (cancelled) return
    if (start === null) start = now
    const elapsed = now - start
    let allLocked = true
    split.chars.forEach((c, i) => {
      if (locked[i]) return
      const localElapsed = elapsed - i * o.stagger * 1000 - delayMs
      if (localElapsed < 0) {
        allLocked = false
        return
      }
      const t = Math.min(1, localElapsed / durationMs)
      const progress = easeAt(points, t)
      const revealT = Math.max(0, (progress - revealDelay) / (1 - revealDelay))
      if (revealT >= 1) {
        c.textContent = finals[i]
        locked[i] = true
      } else {
        allLocked = false
        c.textContent = randChar()
      }
    })
    if (!allLocked) {
      raf = requestAnimationFrame(tick)
    } else {
      onComplete?.() // @internal
    }
  }
  raf = requestAnimationFrame(tick)

  return () => {
    cancelled = true
    cancelAnimationFrame(raf)
    el.classList.remove('k-mono')
    split.revert()
  }
  // #endregion body
}
