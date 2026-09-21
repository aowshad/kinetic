import { gsap } from '../../../lib/gsap'
import type { AnimationImpl } from '../../../lib/types'

export const run: AnimationImpl = (el, o, onComplete) => {
  // #region body
  el.style.display = 'inline-block'
  const tl = gsap.timeline({ delay: o.delay, repeat: -1, yoyo: true })
  tl.to(el, { scale: 1.08, opacity: 0.85, duration: o.duration, ease: o.ease })
  onComplete?.() // @internal
  return () => {
    tl.kill()
    gsap.set(el, { clearProps: 'scale,opacity' })
    el.style.display = ''
  }
  // #endregion body
}
