import { gsap, SplitText } from '../../lib/gsap'
import type { AnimationModule } from '../../lib/types'

const run: AnimationModule['run'] = (el, o, onComplete) => {
  // #region body
  el.setAttribute('aria-label', el.textContent ?? '')
  el.classList.add('k-mono')
  const split = new SplitText(el, { type: 'chars', charsClass: 'k-char' })
  const tl = gsap.timeline({ delay: o.delay })
  split.chars.forEach((c, i) => {
    const text = c.textContent ?? ''
    tl.to(c, { duration: o.duration, scrambleText: { text, chars: 'upperCase', revealDelay: 0.1 }, ease: o.ease }, i * o.stagger)
  })
  tl.call(() => onComplete?.()) // @internal
  return () => {
    tl.progress(1).kill() // @emit: tl.kill()
    el.classList.remove('k-mono')
    split.revert()
  }
  // #endregion body
}
const decodeMatrix: AnimationModule = {
  id: 'decode-matrix', name: 'Decode Matrix', category: 'kinetic',
  roles: ['heading', 'label', 'button'], tags: ['scramble', 'mono'],
  blurb: 'Each character decodes from scrambled noise, one after another.',
  defaults: { duration: 0.4, stagger: 0.05, delay: 0, ease: 'none' },
  plugins: ['ScrambleTextPlugin'], run,
}

export default decodeMatrix
