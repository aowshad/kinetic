import { gsap, SplitText } from '../../../lib/gsap'
import type { AnimationImpl } from '../../../lib/types'

export const run: AnimationImpl = (el, o, onComplete) => {
  // #region body
  el.setAttribute('aria-label', el.textContent ?? '')
  const split = new SplitText(el, { type: 'chars', charsClass: 'k-char' })
  const tl = gsap.timeline({
    scrollTrigger: { trigger: el, start: 'top 85%', end: 'top 25%', scrub: true },
  })
  tl.from(split.chars, { rotation: 40, yPercent: 60, opacity: 0, duration: o.duration, stagger: o.stagger, ease: o.ease })
  onComplete?.() // @internal
  return () => {
    tl.scrollTrigger?.kill()
    tl.kill()
    split.revert()
  }
  // #endregion body
}
