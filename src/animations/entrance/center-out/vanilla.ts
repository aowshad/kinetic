import { splitChars } from '../../../lib/splitChars'
import { LINEAR_EASE_MAP } from '../../../lib/linearEases'
import type { AnimationImpl } from '../../../lib/types'

export const run: AnimationImpl = (el, o, onComplete) => {
  // #region body
  const split = splitChars(el)
  const easing = LINEAR_EASE_MAP[o.ease] ?? 'linear'
  const center = (split.chars.length - 1) / 2
  const rankOf = new Map(
    split.chars
      .map((_, i) => i)
      .sort((a, b) => Math.abs(a - center) - Math.abs(b - center) || a - b)
      .map((i, rank) => [i, rank]),
  )
  const anims = split.chars.map((c, i) =>
    c.animate(
      [
        { transform: 'translateY(50%)', opacity: 0 },
        { transform: 'none', opacity: 1 },
      ],
      {
        duration: o.duration * 1000,
        delay: (o.delay + (rankOf.get(i) ?? i) * o.stagger) * 1000,
        easing,
        fill: 'backwards',
      },
    ),
  )
  Promise.all(anims.map((a) => a.finished)).then(() => onComplete?.()).catch(() => {}) // @internal
  return () => {
    anims.forEach((a) => a.cancel())
    split.revert()
  }
  // #endregion body
}
