import { LINEAR_EASE_MAP } from '../../../lib/linearEases'
import type { AnimationImpl } from '../../../lib/types'

export const run: AnimationImpl = (el, o, onComplete) => {
  // #region body
  const text = el.textContent ?? ''
  el.setAttribute('aria-label', text)
  el.textContent = ''
  el.style.overflow = 'hidden'
  const track = document.createElement('span')
  track.className = 'k-marquee-track'
  ;[0, 1].forEach(() => {
    const seg = document.createElement('span')
    seg.textContent = text
    seg.className = 'k-marquee-seg'
    seg.setAttribute('aria-hidden', 'true')
    track.append(seg)
  })
  el.append(track)
  const easing = LINEAR_EASE_MAP[o.ease] ?? 'linear'
  const anim = track.animate([{ transform: 'translateX(0%)' }, { transform: 'translateX(-50%)' }], {
    duration: o.duration * 1000,
    easing,
    iterations: Infinity,
  })
  onComplete?.() // @internal
  return () => {
    anim.cancel()
    el.textContent = text
    el.style.overflow = ''
  }
  // #endregion body
}
