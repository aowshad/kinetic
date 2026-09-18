import { gsap, SplitText } from '../../lib/gsap'
import type { AnimationModule } from '../../lib/types'

const run: AnimationModule['run'] = (el, o, onComplete) => {
  // #region body
  el.setAttribute('aria-label', el.textContent ?? '')
  const split = new SplitText(el, { type: 'words,chars', wordsClass: 'k-word', charsClass: 'k-char-mask' })
  split.chars.forEach((c) => {
    const mask = document.createElement('span')
    mask.className = 'k-char-clip'
    c.before(mask)
    mask.append(c)
  })
  split.words.forEach((w) => w.setAttribute('aria-hidden', 'true'))
  const tl = gsap.timeline({ delay: o.delay })
  tl.from(split.chars, {
    yPercent: 100,
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
const charMaskUp: AnimationModule = {
  id: 'char-mask-up', name: 'Char Mask Up', category: 'entrance',
  roles: ['heading', 'label'], tags: ['split', 'chars', 'mask'],
  blurb: 'Each character slides up from behind a tight clipping mask.',
  defaults: { duration: 0.5, stagger: 0.025, delay: 0, ease: 'expo.out' },
  plugins: ['SplitText'], run,
}

export default charMaskUp
