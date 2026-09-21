import { gsap } from '../../../lib/gsap'
import type { AnimationImpl } from '../../../lib/types'

export const run: AnimationImpl = (el, o, onComplete) => {
  // #region body
  el.style.display = 'inline-block'
  el.style.transformOrigin = '50% 100%'
  const tl = gsap.timeline({ delay: o.delay, repeat: -1, yoyo: true })
  tl.to(el, { scaleX: 1.15, scaleY: 0.85, duration: o.duration, ease: o.ease })
  onComplete?.() // @internal
  return () => {
    tl.kill()
    gsap.set(el, { clearProps: 'scale' })
    el.style.display = ''
    el.style.transformOrigin = ''
  }
  // #endregion body
}
