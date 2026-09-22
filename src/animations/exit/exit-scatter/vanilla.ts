import { splitChars } from '../../../lib/splitChars'
import { LINEAR_EASE_MAP } from '../../../lib/linearEases'
import type { AnimationImpl } from '../../../lib/types'

export const run: AnimationImpl = (el, o, onComplete) => {
  // #region body
  const split = splitChars(el)
  const easing = LINEAR_EASE_MAP[o.ease] ?? 'linear'
  const anims = split.chars.map((c, i) => {
    const angle = (i / split.chars.length) * Math.PI * 2
    const x = Math.cos(angle) * 60
    const y = Math.sin(angle) * 60
    const rotation = (i % 2 ? 1 : -1) * 45
    return c.animate(
      [
        { transform: 'none', opacity: 1 },
        { transform: `translate(${x}px, ${y}px) rotate(${rotation}deg)`, opacity: 0 },
      ],
      {
        duration: o.duration * 1000,
        delay: (o.delay + i * o.stagger) * 1000,
        easing,
        fill: 'forwards',
      },
    )
  })
  Promise.all(anims.map((a) => a.finished)).then(() => onComplete?.()).catch(() => {}) // @internal
  return () => {
    anims.forEach((a) => a.cancel())
    split.revert()
  }
  // #endregion body
}
