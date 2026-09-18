import { gsap, SplitText } from '../../lib/gsap'
import type { AnimationModule } from '../../lib/types'

const run: AnimationModule['run'] = (el, o, onComplete) => {
  // #region body
  el.setAttribute('aria-label', el.textContent ?? '')
  const split = new SplitText(el, { type: 'words', wordsClass: 'k-word' })
  split.words.forEach((w) => w.setAttribute('aria-hidden', 'true'))

  const tl = gsap.timeline({ delay: o.delay })
  tl.from(split.words, {
    yPercent: 100,
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

const wordFadeUp: AnimationModule = {
  id: 'word-fade-up',
  name: 'Word Fade Up',
  category: 'entrance',
  roles: ['heading', 'paragraph', 'label'],
  tags: ['split', 'words'],
  blurb: 'Each word rises up and fades in, staggered left to right.',
  defaults: { duration: 0.6, stagger: 0.06, delay: 0, ease: 'power3.out' },
  plugins: ['SplitText'],
  run,
}

export default wordFadeUp
