import { splitChars } from '../../../lib/splitChars'
import { LINEAR_EASE_MAP } from '../../../lib/linearEases'
import type { AnimationImpl } from '../../../lib/types'

export const run: AnimationImpl = (el, o, onComplete) => {
  // #region body
  const split = splitChars(el)
  const easing = LINEAR_EASE_MAP[o.ease] ?? 'linear'
  const anims = split.chars.map((c, i) =>
    c.animate([{ transform: 'none' }, { transform: 'translateY(-10px)' }], {
      duration: o.duration * 1000,
      delay: i * o.stagger * 1000,
      easing,
      iterations: Infinity,
      direction: 'alternate',
      fill: 'backwards',
    }),
  )
  onComplete?.() // @internal
  return () => {
    anims.forEach((a) => a.cancel())
    split.revert()
  }
  // #endregion body
}
