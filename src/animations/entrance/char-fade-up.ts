import { gsap, SplitText } from '../../lib/gsap'
import type { AnimationModule } from '../../lib/types'

const run: AnimationModule['run'] = (el, o) => {
  el.setAttribute('aria-label', el.textContent ?? '')
  const split = new SplitText(el, { type: 'words,chars', wordsClass: 'k-word', charsClass: 'k-char' })
  split.words.forEach((w) => w.setAttribute('aria-hidden', 'true'))

  const tl = gsap.timeline({ delay: o.delay })
  tl.from(split.chars, {
    yPercent: 100,
    opacity: 0,
    duration: o.duration,
    stagger: o.stagger,
    ease: o.ease,
    onStart: () => gsap.set(split.chars, { willChange: 'transform, opacity' }),
    onComplete: () => gsap.set(split.chars, { willChange: 'auto' }),
  })

  return () => {
    tl.progress(1).kill()
    split.revert()
  }
}

const charFadeUp: AnimationModule = {
  id: 'char-fade-up',
  name: 'Char Fade Up',
  category: 'entrance',
  roles: ['heading', 'paragraph', 'label'],
  tags: ['split', 'chars'],
  blurb: 'Each character rises up and fades in, staggered left to right.',
  defaults: { duration: 0.6, stagger: 0.02, delay: 0, ease: 'power3.out' },
  plugins: ['SplitText'],
  run,
}

export default charFadeUp
