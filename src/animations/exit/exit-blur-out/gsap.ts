import { gsap } from '../../../lib/gsap'
import type { AnimationImpl } from '../../../lib/types'

export const run: AnimationImpl = (el, o, onComplete) => {
  // #region body
  const tl = gsap.timeline({ delay: o.delay }).to(el, {
    opacity: 0,
    filter: 'blur(10px)',
    duration: o.duration,
    ease: o.ease,
    onComplete, // @internal
  })
  return () => {
    tl.progress(1).kill() // @emit: tl.kill()
  }
  // #endregion body
}
