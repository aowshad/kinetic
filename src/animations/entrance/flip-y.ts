import { gsap, SplitText } from '../../lib/gsap'
import type { AnimationModule } from '../../lib/types'

const run: AnimationModule['run'] = (el, o, onComplete) => {
  // #region body
  el.setAttribute('aria-label', el.textContent ?? '')
  el.style.perspective = '600px'
  const split = new SplitText(el, { type: 'words,chars', wordsClass: 'k-word', charsClass: 'k-char' })
  split.words.forEach((w) => w.setAttribute('aria-hidden', 'true'))
  const tl = gsap.timeline({ delay: o.delay })
  tl.from(split.chars, {
    rotationY: (i) => (i % 2 ? -90 : 90),
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
const flipY: AnimationModule = {
  id: 'flip-y', name: 'Flip Y', category: 'entrance',
  roles: ['heading', 'label'], tags: ['split', '3d'],
  blurb: 'Characters flip in from alternating directions on the Y axis.',
  defaults: { duration: 0.5, stagger: 0.025, delay: 0, ease: 'power2.out' },
  plugins: ['SplitText'], run,
}

export default flipY
