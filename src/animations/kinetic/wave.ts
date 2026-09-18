import { gsap, SplitText } from '../../lib/gsap'
import type { AnimationModule } from '../../lib/types'

const run: AnimationModule['run'] = (el, o, onComplete) => {
  // #region body
  el.setAttribute('aria-label', el.textContent ?? '')
  const split = new SplitText(el, { type: 'words,chars', wordsClass: 'k-word', charsClass: 'k-char' })
  split.words.forEach((w) => w.setAttribute('aria-hidden', 'true'))
  const tl = gsap.to(split.chars, {
    y: -10,
    duration: o.duration,
    stagger: o.stagger,
    ease: o.ease,
    repeat: -1,
    yoyo: true,
  })
  onComplete?.() // @internal
  return () => {
    tl.kill()
    split.revert()
  }
  // #endregion body
}
const wave: AnimationModule = {
  id: 'wave', name: 'Wave', category: 'kinetic',
  roles: ['heading', 'label'], tags: ['loop', 'split'],
  blurb: 'Characters ripple up and down in an endless wave.',
  defaults: { duration: 0.5, stagger: 0.04, delay: 0, ease: 'sine.inOut' },
  plugins: ['SplitText'], run,
}

export default wave
