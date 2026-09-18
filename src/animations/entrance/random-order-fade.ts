import { gsap, SplitText } from '../../lib/gsap'
import type { AnimationModule } from '../../lib/types'

const run: AnimationModule['run'] = (el, o, onComplete) => {
  // #region body
  el.setAttribute('aria-label', el.textContent ?? '')
  const split = new SplitText(el, { type: 'words,chars', wordsClass: 'k-word', charsClass: 'k-char' })
  split.words.forEach((w) => w.setAttribute('aria-hidden', 'true'))
  const tl = gsap.timeline({ delay: o.delay })
  tl.from(split.chars, {
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
const randomOrderFade: AnimationModule = {
  id: 'random-order-fade', name: 'Random Order Fade', category: 'entrance',
  roles: ['heading', 'paragraph', 'label'], tags: ['split', 'random'],
  blurb: 'Characters fade in one by one in a random order.',
  defaults: { duration: 0.4, stagger: 0.03, delay: 0, ease: 'power1.out' },
  plugins: ['SplitText'], run,
}

export default randomOrderFade
