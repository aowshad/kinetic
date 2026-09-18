import { gsap, SplitText } from '../../lib/gsap'
import type { AnimationModule } from '../../lib/types'

const run: AnimationModule['run'] = (el, o, onComplete) => {
  // #region body
  el.setAttribute('aria-label', el.textContent ?? '')
  const split = new SplitText(el, { type: 'words', wordsClass: 'k-word' })
  split.words.forEach((w) => w.setAttribute('aria-hidden', 'true'))
  const tl = gsap.timeline({ delay: o.delay })
  tl.from(split.words, {
    x: -40,
    skewX: 20,
    opacity: 0,
    duration: o.duration,
    stagger: o.stagger,
    ease: o.ease,
    onComplete, // @internal
  })
  return () => {
    tl.progress(1).kill() // @emit: tl.kill()
    split.revert()
  }
  // #endregion body
}
const skewSlideIn: AnimationModule = {
  id: 'skew-slide-in', name: 'Skew Slide In', category: 'entrance',
  roles: ['heading', 'paragraph', 'label'], tags: ['split', 'skew'],
  blurb: 'Each word slides in from the left with a skew.',
  defaults: { duration: 0.5, stagger: 0.05, delay: 0, ease: 'power3.out' },
  plugins: ['SplitText'], run,
}

export default skewSlideIn
