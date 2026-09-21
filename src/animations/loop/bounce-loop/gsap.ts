import { gsap } from '../../../lib/gsap'
import type { AnimationImpl } from '../../../lib/types'

export const run: AnimationImpl = (el, o, onComplete) => {
  // #region body
  el.style.display = 'inline-block'
  const tl = gsap.fromTo(
    el,
    { y: -20 },
    { y: 0, duration: o.duration, ease: o.ease, repeat: -1, repeatDelay: o.duration * 0.4, delay: o.delay },
  )
  onComplete?.() // @internal
  return () => {
    tl.kill()
    gsap.set(el, { clearProps: 'y' })
    el.style.display = ''
  }
  // #endregion body
}
