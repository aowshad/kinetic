import { gsap } from '../../../lib/gsap'
import type { AnimationImpl } from '../../../lib/types'

export const run: AnimationImpl = (el, o, onComplete) => {
  // #region body
  gsap.set(el, { filter: 'blur(10px)', opacity: 0.4 })
  const tl = gsap.timeline({
    scrollTrigger: { trigger: el, start: 'top 85%', end: 'top 35%', scrub: true },
  })
  tl.to(el, { filter: 'blur(0px)', opacity: 1, duration: o.duration, ease: o.ease })
  onComplete?.() // @internal
  return () => {
    tl.scrollTrigger?.kill()
    tl.kill()
    gsap.set(el, { clearProps: 'filter,opacity' })
  }
  // #endregion body
}
