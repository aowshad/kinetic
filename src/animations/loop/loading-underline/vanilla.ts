import { LINEAR_EASE_MAP } from '../../../lib/linearEases'
import type { AnimationImpl } from '../../../lib/types'

export const run: AnimationImpl = (el, o, onComplete) => {
  // #region body
  el.style.position = 'relative'
  el.style.display = 'inline-block'
  const bar = document.createElement('span')
  bar.className = 'k-loop-underline'
  bar.setAttribute('aria-hidden', 'true')
  el.append(bar)
  const easing = LINEAR_EASE_MAP[o.ease] ?? 'linear'
  const anim = bar.animate(
    [{ transform: 'translateX(-100%)' }, { transform: 'translateX(100%)' }],
    {
      duration: o.duration * 1000,
      delay: o.delay * 1000,
      easing,
      iterations: Infinity,
      direction: 'alternate',
      fill: 'backwards',
    },
  )
  onComplete?.() // @internal
  return () => {
    anim.cancel()
    bar.remove()
    el.style.position = ''
    el.style.display = ''
  }
  // #endregion body
}
