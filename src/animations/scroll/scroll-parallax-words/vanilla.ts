import { splitChars } from '../../../lib/splitChars'
import { LINEAR_EASE_MAP } from '../../../lib/linearEases'
import { scrollScrub } from '../../../lib/scrollScrub'
import type { AnimationImpl } from '../../../lib/types'

export const run: AnimationImpl = (el, o, onComplete) => {
  // #region body
  const split = splitChars(el)
  const easing = LINEAR_EASE_MAP[o.ease] ?? 'linear'
  // GSAP's trigger here is start: 'top bottom', end: 'bottom top' — the
  // subject's entire time anywhere on screen, i.e. the full 'cover' range.
  // startVh: 1 is cover 0% exactly; endVh: -10 is an extreme past cover
  // 100% that scrollScrub clamps back down to it.
  const cancels = split.words.map((w, i) =>
    scrollScrub(w, [{ transform: 'translateY(0%)' }, { transform: `translateY(${-(i + 1) * 35}%)` }], { easing }, el, 1, -10),
  )
  onComplete?.() // @internal
  return () => {
    cancels.forEach((cancel) => cancel())
    split.revert()
  }
  // #endregion body
}
