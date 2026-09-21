import { gsap, SplitText } from '../../../lib/gsap'
import type { AnimationImpl } from '../../../lib/types'

export const run: AnimationImpl = (el, o, onComplete) => {
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
