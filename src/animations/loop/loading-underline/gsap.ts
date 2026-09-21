import { gsap } from '../../../lib/gsap'
import type { AnimationImpl } from '../../../lib/types'

export const run: AnimationImpl = (el, o, onComplete) => {
  // #region body
  el.style.position = 'relative'
  el.style.display = 'inline-block'
  const bar = document.createElement('span')
  bar.className = 'k-loop-underline'
  bar.setAttribute('aria-hidden', 'true')
  el.append(bar)
  const tl = gsap.timeline({ delay: o.delay, repeat: -1, yoyo: true })
  tl.fromTo(bar, { xPercent: -100 }, { xPercent: 100, duration: o.duration, ease: o.ease })
  onComplete?.() // @internal
  return () => {
    tl.kill()
    bar.remove()
    el.style.position = ''
    el.style.display = ''
  }
  // #endregion body
}
