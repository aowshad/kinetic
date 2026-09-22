import { LINEAR_EASE_MAP } from '../../../lib/linearEases'
import type { AnimationImpl } from '../../../lib/types'

export const run: AnimationImpl = (el, o, onComplete) => {
  // #region body
  el.classList.add('k-shimmer')
  const easing = LINEAR_EASE_MAP[o.ease] ?? 'linear'
  const anim = el.animate([{ backgroundPosition: '150% 0' }, { backgroundPosition: '-50% 0' }], {
    duration: o.duration * 1000,
    delay: o.delay * 1000,
    easing,
    iterations: Infinity,
  })
  onComplete?.() // @internal
  return () => {
    anim.cancel()
    el.classList.remove('k-shimmer')
  }
  // #endregion body
}
