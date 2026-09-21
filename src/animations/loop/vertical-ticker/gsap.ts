import { gsap } from '../../../lib/gsap'
import type { AnimationImpl } from '../../../lib/types'

export const run: AnimationImpl = (el, o, onComplete) => {
  // #region body
  const text = el.textContent ?? ''
  el.setAttribute('aria-label', text)
  el.textContent = ''
  el.style.overflow = 'hidden'
  const track = document.createElement('span')
  track.className = 'k-vticker-track'
  ;[0, 1].forEach(() => {
    const seg = document.createElement('span')
    seg.textContent = text
    seg.className = 'k-vticker-seg'
    seg.setAttribute('aria-hidden', 'true')
    track.append(seg)
  })
  el.append(track)
  const tl = gsap.timeline({ repeat: -1 })
  tl.fromTo(track, { yPercent: 0 }, { yPercent: -50, duration: o.duration, ease: o.ease })
  onComplete?.() // @internal
  return () => {
    tl.kill()
    el.textContent = text
    el.style.overflow = ''
  }
  // #endregion body
}
