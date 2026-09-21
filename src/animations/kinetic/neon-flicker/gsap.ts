import { gsap } from '../../../lib/gsap'
import type { AnimationImpl } from '../../../lib/types'

export const run: AnimationImpl = (el, o, onComplete) => {
  // #region body
  el.classList.add('k-neon')
  const tl = gsap.timeline({ delay: o.delay, repeat: -1, repeatDelay: o.duration * 8 })
  tl.to(el, { opacity: 0.3, duration: o.duration, repeat: 5, yoyo: true, ease: o.ease })
  onComplete?.() // @internal
  return () => {
    tl.kill()
    el.classList.remove('k-neon')
    gsap.set(el, { clearProps: 'opacity' })
  }
  // #endregion body
}
