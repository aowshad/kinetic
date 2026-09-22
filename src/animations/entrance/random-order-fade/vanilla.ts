import { splitChars } from '../../../lib/splitChars'
import { LINEAR_EASE_MAP } from '../../../lib/linearEases'
import type { AnimationImpl } from '../../../lib/types'

export const run: AnimationImpl = (el, o, onComplete) => {
  // #region body
  const split = splitChars(el)
  const easing = LINEAR_EASE_MAP[o.ease] ?? 'linear'
  const order = split.chars.map((_, i) => i)
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[order[i], order[j]] = [order[j], order[i]]
  }
  const anims = split.chars.map((c, i) =>
    c.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: o.duration * 1000,
      delay: (o.delay + order[i] * o.stagger) * 1000,
      easing,
      fill: 'backwards',
    }),
  )
  Promise.all(anims.map((a) => a.finished)).then(() => onComplete?.()) // @internal
  return () => {
    anims.forEach((a) => a.cancel())
    split.revert()
  }
  // #endregion body
}
