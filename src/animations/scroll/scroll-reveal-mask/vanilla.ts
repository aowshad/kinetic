import { LINEAR_EASE_MAP } from '../../../lib/linearEases'
import { scrollScrub } from '../../../lib/scrollScrub'
import type { AnimationImpl } from '../../../lib/types'

export const run: AnimationImpl = (el, o, onComplete) => {
  // #region body
  el.style.clipPath = 'inset(0 100% 0 0)'
  const easing = LINEAR_EASE_MAP[o.ease] ?? 'linear'
  const cancel = scrollScrub(
    el,
    [{ clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)' }],
    { easing },
    el,
    0.85,
    0.35,
  )
  onComplete?.() // @internal
  return () => {
    cancel()
    el.style.clipPath = ''
  }
  // #endregion body
}
