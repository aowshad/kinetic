import { gsap, SplitText } from '../../lib/gsap'
import type { AnimationModule } from '../../lib/types'

const run: AnimationModule['run'] = (el, o, onComplete) => {
  // #region body
  el.setAttribute('aria-label', el.textContent ?? '')
  const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()
  const split = new SplitText(el, { type: 'words', wordsClass: 'k-word' })
  const tl = gsap.timeline({
    scrollTrigger: { trigger: el, start: 'top 85%', end: 'top 25%', scrub: true },
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
const scrollColorSweep: AnimationModule = {
  id: 'scroll-color-sweep', name: 'Scroll Color Sweep', category: 'scroll',
  roles: ['heading', 'paragraph', 'label'], tags: ['scrub', 'split', 'color'],
  blurb: 'Words pick up an accent color one by one as you scroll past them.',
  defaults: { duration: 0.5, stagger: 0.1, delay: 0, ease: 'none' },
  plugins: ['SplitText', 'ScrollTrigger'], run,
}

export default scrollColorSweep
