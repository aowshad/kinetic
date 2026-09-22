import { splitChars } from '../../../lib/splitChars'
import { LINEAR_EASE_MAP } from '../../../lib/linearEases'
import type { AnimationImpl } from '../../../lib/types'

export const run: AnimationImpl = (el, o, onComplete) => {
  // #region body
  el.style.perspective = '800px'
  const split = splitChars(el)
  const easing = LINEAR_EASE_MAP[o.ease] ?? 'linear'
  const anims = split.chars.map((c, i) => {
    c.style.transformOrigin = '50% 50% -60px'
    return c.animate(
      [
        { transform: 'rotateX(-90deg)', opacity: 0 },
        { transform: 'rotateX(0deg)', opacity: 1 },
      ],
      {
        duration: o.duration * 1000,
        delay: (o.delay + i * o.stagger) * 1000,
        easing,
        fill: 'backwards',
      },
    )
  })
  Promise.all(anims.map((a) => a.finished)).then(() => onComplete?.()) // @internal
  return () => {
    anims.forEach((a) => a.cancel())
    split.revert()
    el.style.perspective = ''
  }
  // #endregion body
}
