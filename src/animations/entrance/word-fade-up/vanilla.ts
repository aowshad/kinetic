import { splitChars } from '../../../lib/splitChars'
import { LINEAR_EASE_MAP } from '../../../lib/linearEases'
import type { AnimationImpl } from '../../../lib/types'

export const run: AnimationImpl = (el, o, onComplete) => {
  // #region body
  const split = splitChars(el)
  const easing = LINEAR_EASE_MAP[o.ease] ?? 'linear'
  const anims = split.words.map((w, i) =>
    w.animate(
      [
        { transform: 'translateY(100%)', opacity: 0 },
        { transform: 'none', opacity: 1 },
      ],
      {
        duration: o.duration * 1000,
        delay: (o.delay + i * o.stagger) * 1000,
        easing,
        fill: 'backwards',
      },
    ),
  )
  Promise.all(anims.map((a) => a.finished)).then(() => onComplete?.()) // @internal
  return () => {
    anims.forEach((a) => a.cancel())
    split.revert()
  }
  // #endregion body
}
