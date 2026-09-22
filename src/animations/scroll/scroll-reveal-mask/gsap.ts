import { gsap } from '../../../lib/gsap'
import type { AnimationImpl } from '../../../lib/types'

export const run: AnimationImpl = (el, o, onComplete) => {
  // #region body
  gsap.set(el, { clipPath: 'inset(0 100% 0 0)' })
  const tl = gsap.timeline({
    scrollTrigger: { trigger: el, scroller: el.closest('[data-scroll-demo]') || undefined, start: 'top 85%', end: 'top 35%', scrub: true },
  })
  tl.to(el, { clipPath: 'inset(0 0% 0 0)', duration: o.duration, ease: o.ease })
  onComplete?.() // @internal
  return () => {
    tl.scrollTrigger?.kill()
    tl.kill()
    gsap.set(el, { clearProps: 'clipPath' })
  }
  // #endregion body
}
