import { splitChars } from '../../../lib/splitChars'
import { LINEAR_EASE_MAP } from '../../../lib/linearEases'
import type { AnimationImpl } from '../../../lib/types'

export const run: AnimationImpl = (el, o, onComplete) => {
  // #region body
  const split = splitChars(el)
  split.chars.forEach((c) => {
    const mask = document.createElement('span')
    mask.className = 'k-char-clip'
    c.before(mask)
    mask.append(c)
  })
  const easing = LINEAR_EASE_MAP[o.ease] ?? 'linear'
  const anims = split.chars.map((c, i) =>
    c.animate([{ transform: 'translateY(100%)' }, { transform: 'none' }], {
      duration: o.duration * 1000,
      delay: (o.delay + i * o.stagger) * 1000,
      easing,
      fill: 'backwards',
    }),
  )
  Promise.all(anims.map((a) => a.finished)).then(() => onComplete?.()).catch(() => {}) // @internal
  return () => {
    anims.forEach((a) => a.cancel())
    split.revert()
  }
  // #endregion body
}
