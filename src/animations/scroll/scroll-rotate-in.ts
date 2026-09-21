import { gsap, SplitText } from '../../lib/gsap'
import type { AnimationModule } from '../../lib/types'

const run: AnimationModule['run'] = (el, o, onComplete) => {
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
const scrollRotateIn: AnimationModule = {
  id: 'scroll-rotate-in', name: 'Scroll Rotate In', category: 'scroll',
  roles: ['heading', 'label'], tags: ['scrub', 'split', 'rotate'],
  blurb: 'Characters tumble upright one after another as you scroll.',
  defaults: { duration: 0.5, stagger: 0.04, delay: 0, ease: 'power2.out' },
  plugins: ['SplitText', 'ScrollTrigger'], run,
}

export default scrollRotateIn
