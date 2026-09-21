import { gsap, SplitText } from '../../lib/gsap'
import type { AnimationModule } from '../../lib/types'

const run: AnimationModule['run'] = (el, o, onComplete) => {
  // #region body
  el.setAttribute('aria-label', el.textContent ?? '')
  const split = new SplitText(el, { type: 'words,chars', wordsClass: 'k-word', charsClass: 'k-char' })
  split.words.forEach((w) => w.setAttribute('aria-hidden', 'true'))
  const tl = gsap.timeline({
    scrollTrigger: { trigger: el, start: 'top 85%', end: 'top 25%', scrub: true },
  })
  tl.from(split.chars, { yPercent: 120, opacity: 0, duration: o.duration, stagger: o.stagger, ease: o.ease })
  onComplete?.() // @internal
  return () => {
    tl.scrollTrigger?.kill()
    tl.kill()
    split.revert()
  }
  // #endregion body
}
const scrollFadeStagger: AnimationModule = {
  id: 'scroll-fade-stagger', name: 'Scroll Fade Stagger', category: 'scroll',
  roles: ['heading', 'paragraph'], tags: ['scrub', 'split'],
  blurb: 'Characters rise and fade in one after another as you scroll.',
  defaults: { duration: 0.6, stagger: 0.03, delay: 0, ease: 'power2.out' },
  plugins: ['SplitText', 'ScrollTrigger'], run,
}

export default scrollFadeStagger
