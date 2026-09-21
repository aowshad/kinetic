import { gsap, SplitText } from '../../lib/gsap'
import type { AnimationModule } from '../../lib/types'

const run: AnimationModule['run'] = (el, o, onComplete) => {
  // #region body
  const split = new SplitText(el, { type: 'words', wordsClass: 'k-word' })
  const tl = gsap.timeline({
    scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
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
const scrollParallaxWords: AnimationModule = {
  id: 'scroll-parallax-words', name: 'Scroll Parallax Words', category: 'scroll',
  roles: ['heading'], tags: ['scrub', 'split', 'parallax'],
  blurb: 'Each word drifts upward at its own speed as the page scrolls.',
  defaults: { duration: 1, stagger: 0, delay: 0, ease: 'none' },
  plugins: ['SplitText', 'ScrollTrigger'], run,
}

export default scrollParallaxWords
