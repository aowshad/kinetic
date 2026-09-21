import { gsap } from '../../../lib/gsap'
import type { AnimationImpl } from '../../../lib/types'

export const run: AnimationImpl = (el, o, onComplete) => {
  // #region body
  const text = el.textContent ?? ''
  const tl = gsap.timeline({ delay: o.delay }).to(el, {
    duration: o.duration,
    scrambleText: { text, chars: 'upperCase', revealDelay: 0.3, speed: 0.4 },
    ease: o.ease,
    onComplete, // @internal
  })
  return () => {
    tl.progress(1).kill() // @emit: tl.kill()
  }
  // #endregion body
}
