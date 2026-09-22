import { splitChars } from '../../../lib/splitChars'
import { LINEAR_EASE_MAP } from '../../../lib/linearEases'
import { scrollScrub } from '../../../lib/scrollScrub'
import type { AnimationImpl } from '../../../lib/types'

export const run: AnimationImpl = (el, o, onComplete) => {
  // #region body
  el.setAttribute('aria-label', el.textContent ?? '')
  const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()
  const baseColor = getComputedStyle(el).color
  const split = splitChars(el)
  const easing = LINEAR_EASE_MAP[o.ease] ?? 'linear'
  const n = split.words.length
  const spanPercent = Math.min(100, (100 / n) * 4)
  const cancels = split.words.map((w, i) => {
    const startPercent = (i / Math.max(1, n - 1)) * (100 - spanPercent)
    return scrollScrub(
      w,
      [{ color: baseColor }, { color: accent }],
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
