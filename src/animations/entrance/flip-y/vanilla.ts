import { splitChars } from '../../../lib/splitChars'
import { LINEAR_EASE_MAP } from '../../../lib/linearEases'
import type { AnimationImpl } from '../../../lib/types'

export const run: AnimationImpl = (el, o, onComplete) => {
  // #region body
  el.style.perspective = '600px'
  const split = splitChars(el)
  const easing = LINEAR_EASE_MAP[o.ease] ?? 'linear'
  const anims = split.chars.map((c, i) => {
    const from = i % 2 ? -90 : 90
    return c.animate(
      [
        { transform: `rotateY(${from}deg)`, opacity: 0 },
        { transform: 'rotateY(0deg)', opacity: 1 },
      ],
      {
        duration: o.duration * 1000,
        delay: (o.delay + i * o.stagger) * 1000,
        easing,
        fill: 'backwards',
      },
    )
  })
  Promise.all(anims.map((a) => a.finished)).then(() => onComplete?.()).catch(() => {}) // @internal
  return () => {
    anims.forEach((a) => a.cancel())
    split.revert()
    el.style.perspective = ''
  }
  // #endregion body
}
