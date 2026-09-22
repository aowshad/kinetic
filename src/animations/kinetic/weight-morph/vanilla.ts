import { LINEAR_EASE_MAP } from '../../../lib/linearEases'
import type { AnimationImpl } from '../../../lib/types'

export const run: AnimationImpl = (el, o, onComplete) => {
  // #region body
  const text = el.textContent ?? ''
  el.setAttribute('aria-label', text)
  el.style.position = 'relative'
  el.style.whiteSpace = 'nowrap'
  const bold = document.createElement('span')
  bold.textContent = text
  bold.className = 'k-weight-bold'
  bold.setAttribute('aria-hidden', 'true')
  el.append(bold)
  const easing = LINEAR_EASE_MAP[o.ease] ?? 'linear'
  const anim = bold.animate([{ opacity: 0 }, { opacity: 1 }], {
    duration: o.duration * 1000,
    delay: o.delay * 1000,
    easing,
    iterations: Infinity,
    direction: 'alternate',
    fill: 'backwards',
  })
  onComplete?.() // @internal
  return () => {
    anim.cancel()
    bold.remove()
    el.style.whiteSpace = ''
  }
  // #endregion body
}
