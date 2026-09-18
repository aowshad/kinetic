import { gsap, SplitText } from '../../lib/gsap'
import type { AnimationModule } from '../../lib/types'

const run: AnimationModule['run'] = (el, o, onComplete) => {
  // #region body
  el.setAttribute('aria-label', el.textContent ?? '')
  const split = new SplitText(el, { type: 'words,chars', wordsClass: 'k-word', charsClass: 'k-char' })
  split.words.forEach((w) => w.setAttribute('aria-hidden', 'true'))
  const tl = gsap.timeline({ delay: o.delay })
  tl.from(split.chars, {
    y: -80,
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
const dropBounce: AnimationModule = {
  id: 'drop-bounce', name: 'Drop Bounce', category: 'entrance',
  roles: ['heading', 'label'], tags: ['split', 'bounce'],
  blurb: 'Characters drop from above and bounce into place.',
  defaults: { duration: 0.8, stagger: 0.04, delay: 0, ease: 'bounce.out' },
  plugins: ['SplitText'], run,
}

export default dropBounce
