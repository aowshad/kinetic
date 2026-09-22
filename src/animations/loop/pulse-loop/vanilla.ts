import { LINEAR_EASE_MAP } from '../../../lib/linearEases'
import type { AnimationImpl } from '../../../lib/types'

export const run: AnimationImpl = (el, o, onComplete) => {
  // #region body
  el.style.display = 'inline-block'
  const easing = LINEAR_EASE_MAP[o.ease] ?? 'linear'
  const anim = el.animate(
    [
      { transform: 'none', opacity: 1 },
      { transform: 'scale(1.08)', opacity: 0.85 },
    ],
    {
      duration: o.duration * 1000,
      delay: o.delay * 1000,
      easing,
      iterations: Infinity,
      direction: 'alternate',
      fill: 'backwards',
    },
  )
  onComplete?.() // @internal
  return () => {
    anim.cancel()
    el.style.display = ''
  }
  // #endregion body
}
