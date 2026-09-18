import { gsap, SplitText } from '../../lib/gsap'
import type { AnimationModule } from '../../lib/types'

const run: AnimationModule['run'] = (el, o, onComplete) => {
  // #region body
  el.setAttribute('aria-label', el.textContent ?? '')
  const split = new SplitText(el, { type: 'words,chars', wordsClass: 'k-word', charsClass: 'k-char' })
  split.words.forEach((w) => w.setAttribute('aria-hidden', 'true'))
  const tl = gsap.timeline({ delay: o.delay })
  tl.from(split.chars, {
    scale: 0,
    opacity: 0,
    duration: o.duration,
    stagger: { each: o.stagger, from: 'random' },
    ease: o.ease,
    onComplete, // @internal
  })
  return () => {
    tl.progress(1).kill() // @emit: tl.kill()
    split.revert()
  }
  // #endregion body
}
const scalePop: AnimationModule = {
  id: 'scale-pop', name: 'Scale Pop', category: 'entrance',
  roles: ['heading', 'label', 'button'], tags: ['split', 'scale'],
  blurb: 'Characters pop in from nothing in a random order.',
  defaults: { duration: 0.5, stagger: 0.03, delay: 0, ease: 'back.out(2)' },
  plugins: ['SplitText'], run,
}

export default scalePop
