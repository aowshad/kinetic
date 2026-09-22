import { LINEAR_EASE_MAP } from '../../../lib/linearEases'
import type { AnimationImpl } from '../../../lib/types'

export const run: AnimationImpl = (el, o, onComplete) => {
  // #region body
  el.style.display = 'inline-block'
  el.style.transformOrigin = '50% 100%'
  const easing = LINEAR_EASE_MAP[o.ease] ?? 'linear'
  const anim = el.animate([{ transform: 'scale(1, 1)' }, { transform: 'scale(1.15, 0.85)' }], {
    duration: o.duration * 1000,
    delay: o.delay * 1000,
    easing,
    iterations: Infinity,
    direction: 'alternate',
    fill: 'backwards',
  })
  onComplete?.() // @internal
  return () => {
    anim.cancel()
    el.style.display = ''
    el.style.transformOrigin = ''
  }
  // #endregion body
}
