import { gsap, SplitText } from '../../../lib/gsap'
import type { AnimationImpl } from '../../../lib/types'

export const run: AnimationImpl = (el, o, onComplete) => {
  // #region body
  el.setAttribute('aria-label', el.textContent ?? '')
  // Your page's --accent if it defines one, otherwise a literal green.
  const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#00d26a'
  const split = new SplitText(el, { type: 'words', wordsClass: 'k-word' })
  const tl = gsap.timeline({
    scrollTrigger: { trigger: el, scroller: el.closest('[data-scroll-demo]') || undefined, start: 'top 85%', end: 'top 25%', scrub: true },
  })
  tl.to(split.words, { color: accent, duration: o.duration, stagger: o.stagger, ease: o.ease })
  onComplete?.() // @internal
  return () => {
    tl.scrollTrigger?.kill()
    tl.kill()
    split.revert()
  }
  // #endregion body
}
