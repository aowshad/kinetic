import { gsap, SplitText } from '../../lib/gsap'
import type { AnimationModule } from '../../lib/types'

const run: AnimationModule['run'] = (el, o, onComplete) => {
  // #region body
  el.setAttribute('aria-label', el.textContent ?? '')
  const split = new SplitText(el, { type: 'words,chars', wordsClass: 'k-word', charsClass: 'k-char' })
  split.words.forEach((w) => w.setAttribute('aria-hidden', 'true'))

  const tl = gsap.timeline({ delay: o.delay })
  tl.from(split.chars, {
    filter: 'blur(12px)',
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

const blurIn: AnimationModule = {
  id: 'blur-in',
  name: 'Blur In',
  category: 'entrance',
  roles: ['heading', 'paragraph', 'label'],
  tags: ['split', 'blur'],
  blurb: 'Characters sharpen into focus as they fade in from a blur.',
  defaults: { duration: 0.5, stagger: 0.02, delay: 0, ease: 'power2.out' },
  plugins: ['SplitText'],
  run,
}

export default blurIn
