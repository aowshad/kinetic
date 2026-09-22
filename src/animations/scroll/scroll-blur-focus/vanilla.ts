import { LINEAR_EASE_MAP } from '../../../lib/linearEases'
import { scrollScrub } from '../../../lib/scrollScrub'
import type { AnimationImpl } from '../../../lib/types'

export const run: AnimationImpl = (el, o, onComplete) => {
  // #region body
  el.style.filter = 'blur(10px)'
  el.style.opacity = '0.4'
  const easing = LINEAR_EASE_MAP[o.ease] ?? 'linear'
  const cancel = scrollScrub(
    el,
    [
      { filter: 'blur(10px)', opacity: 0.4 },
      { filter: 'blur(0px)', opacity: 1 },
    ],
    { easing },
    el,
    0.85,
    0.35,
  )
  onComplete?.() // @internal
  return () => {
    cancel()
    el.style.filter = ''
    el.style.opacity = ''
  }
  // #endregion body
}
