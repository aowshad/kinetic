import { LINEAR_EASE_MAP } from '../../../lib/linearEases'
import type { AnimationImpl } from '../../../lib/types'

export const run: AnimationImpl = (el, o, onComplete) => {
  // #region body
  const text = el.textContent ?? ''
  el.setAttribute('aria-label', text)
  el.style.position = 'relative'
  const clones = [0, 1].map((i) => {
    const clone = document.createElement('span')
    clone.textContent = text
    clone.className = i ? 'k-glitch-cyan' : 'k-glitch-red'
    clone.setAttribute('aria-hidden', 'true')
    el.append(clone)
    return clone
  })
  const easing = LINEAR_EASE_MAP[o.ease] ?? 'linear'
  const legMs = (o.duration / 6) * 1000
  const delayMs = o.delay * 1000
  // 6 alternating legs, matching GSAP's repeat: 5, yoyo: true — an even leg
  // count lands back on the "from" keyframe, so both clones settle neutral
  // without needing an explicit reset tween at the end.
  const anim0 = clones[0].animate(
    [
      { transform: 'translateX(0px)', clipPath: 'inset(0% 0 0% 0)' },
      { transform: 'translateX(-6px)', clipPath: 'inset(10% 0 40% 0)' },
    ],
    { duration: legMs, delay: delayMs, iterations: 6, direction: 'alternate', easing, fill: 'both' },
  )
  const anim1 = clones[1].animate(
    [
      { transform: 'translateX(0px)', clipPath: 'inset(0% 0 0% 0)' },
      { transform: 'translateX(6px)', clipPath: 'inset(40% 0 10% 0)' },
    ],
    { duration: legMs, delay: delayMs, iterations: 6, direction: 'alternate', easing, fill: 'both' },
  )
  Promise.all([anim0.finished, anim1.finished])
    .then(() => onComplete?.())
    .catch(() => {}) // @internal
  return () => {
    anim0.cancel()
    anim1.cancel()
    clones.forEach((c) => c.remove())
  }
  // #endregion body
}
