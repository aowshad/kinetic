import { LINEAR_EASE_MAP } from '../../../lib/linearEases'
import type { AnimationImpl } from '../../../lib/types'

export const run: AnimationImpl = (el, o, onComplete) => {
  // #region body
  el.classList.add('k-neon')
  const easing = LINEAR_EASE_MAP[o.ease] ?? 'linear'
  // GSAP nests a 6-leg flicker burst inside an outer repeat with a long
  // repeatDelay — built here as one set of keyframes: 6 alternating legs
  // (each carrying the real ease) packed into the front of the cycle,
  // followed by a flat hold for the "repeatDelay" portion.
  const legs = 6
  const holdUnits = 8
  const totalUnits = legs + holdUnits
  const keyframes: Keyframe[] = [] // @emit: const keyframes = []
  for (let i = 0; i <= legs; i++) {
    const kf: Keyframe = { opacity: i % 2 === 0 ? 1 : 0.3, offset: i / totalUnits } // @emit: const kf = { opacity: i % 2 === 0 ? 1 : 0.3, offset: i / totalUnits }
    if (i > 0) kf.easing = easing
    keyframes.push(kf)
  }
  keyframes.push({ opacity: 1, offset: 1 })
  const anim = el.animate(keyframes, {
    duration: totalUnits * o.duration * 1000,
    delay: o.delay * 1000,
    iterations: Infinity,
    fill: 'backwards',
  })
  onComplete?.() // @internal
  return () => {
    anim.cancel()
    el.classList.remove('k-neon')
  }
  // #endregion body
}
