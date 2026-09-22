import { LINEAR_EASE_MAP } from '../../../lib/linearEases'
import type { AnimationImpl } from '../../../lib/types'

export const run: AnimationImpl = (el, o, onComplete) => {
  // #region body
  el.style.display = 'inline-block'
  const easing = LINEAR_EASE_MAP[o.ease] ?? 'linear'
  const repeatDelay = o.duration * 0.4
  const activeFraction = o.duration / (o.duration + repeatDelay)
  const anim = el.animate(
    [
      { transform: 'translateY(-20px)', offset: 0 },
      { transform: 'none', offset: activeFraction, easing },
      { transform: 'none', offset: 1 },
    ],
    {
      duration: (o.duration + repeatDelay) * 1000,
      delay: o.delay * 1000,
      iterations: Infinity,
      fill: 'backwards',
    },
  )
  onComplete?.() // @internal
  return () => {
    anim.cancel()
    el.style.display = ''
  }
  // #endregion body
}
