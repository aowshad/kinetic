import { splitChars } from '../../../lib/splitChars'
import { LINEAR_EASE_MAP } from '../../../lib/linearEases'
import { scrollScrub } from '../../../lib/scrollScrub'
import type { AnimationImpl } from '../../../lib/types'

export const run: AnimationImpl = (el, o, onComplete) => {
  // #region body
  el.setAttribute('aria-label', el.textContent ?? '')
  const split = splitChars(el)
  const easing = LINEAR_EASE_MAP[o.ease] ?? 'linear'
  const n = split.chars.length
  const spanPercent = Math.min(100, (100 / n) * 4)
  const cancels = split.chars.map((c, i) => {
    c.style.transform = 'rotate(40deg) translateY(60%)'
    c.style.opacity = '0'
    const startPercent = (i / Math.max(1, n - 1)) * (100 - spanPercent)
    return scrollScrub(
      c,
      [
        { transform: 'rotate(40deg) translateY(60%)', opacity: 0 },
        { transform: 'none', opacity: 1 },
      ],
      { easing },
      el,
      0.85,
      0.25,
      startPercent,
      startPercent + spanPercent,
    )
  })
  onComplete?.() // @internal
  return () => {
    cancels.forEach((cancel) => cancel())
    split.revert()
  }
  // #endregion body
}
