import { gsap, SplitText } from '../../../lib/gsap'
import type { AnimationImpl } from '../../../lib/types'

export const run: AnimationImpl = (el, o, onComplete) => {
  // #region body
  const split = new SplitText(el, { type: 'words', wordsClass: 'k-word' })
  const tl = gsap.timeline({
    scrollTrigger: { trigger: el, scroller: el.closest('[data-scroll-demo]') || undefined, start: 'top bottom', end: 'bottom top', scrub: true },
  })
  split.words.forEach((w, i) => {
    tl.to(w, { yPercent: -(i + 1) * 35, duration: o.duration, ease: o.ease }, 0)
  })
  onComplete?.() // @internal
  return () => {
    tl.scrollTrigger?.kill()
    tl.kill()
    split.revert()
  }
  // #endregion body
}
