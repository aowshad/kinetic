import { LINEAR_EASE_MAP } from '../../../lib/linearEases'
import type { AnimationImpl } from '../../../lib/types'

export const run: AnimationImpl = (el, o, onComplete) => {
  // #region body
  const easing = LINEAR_EASE_MAP[o.ease] ?? 'linear'
  const anim = el.animate(
    [
      { transform: 'none', opacity: 1 },
      { transform: 'translateY(24px)', opacity: 0 },
    ],
    { duration: o.duration * 1000, delay: o.delay * 1000, easing, fill: 'forwards' },
  )
  anim.finished.then(() => onComplete?.()).catch(() => {}) // @internal
  return () => {
    anim.cancel()
  }
  // #endregion body
}
