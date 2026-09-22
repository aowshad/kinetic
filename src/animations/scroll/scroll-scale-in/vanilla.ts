import { LINEAR_EASE_MAP } from '../../../lib/linearEases'
import { scrollScrub } from '../../../lib/scrollScrub'
import type { AnimationImpl } from '../../../lib/types'

export const run: AnimationImpl = (el, o, onComplete) => {
  // #region body
  el.style.transform = 'scale(0.6)'
  el.style.transformOrigin = '50% 50%'
  const easing = LINEAR_EASE_MAP[o.ease] ?? 'linear'
  const cancel = scrollScrub(el, [{ transform: 'scale(0.6)' }, { transform: 'scale(1)' }], { easing }, el, 0.85, 0.3)
  onComplete?.() // @internal
  return () => {
    cancel()
    el.style.transform = ''
    el.style.transformOrigin = ''
  }
  // #endregion body
}
