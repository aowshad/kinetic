import { gsap, SplitText } from '../../../lib/gsap'
import type { AnimationImpl } from '../../../lib/types'

export const run: AnimationImpl = (el, o, onComplete) => {
  // #region body
  el.setAttribute('aria-label', el.textContent ?? '')
  const split = new SplitText(el, { type: 'words,chars', wordsClass: 'k-word', charsClass: 'k-char' })
  split.words.forEach((w) => w.setAttribute('aria-hidden', 'true'))
  const tl = gsap.to(split.chars, {
    y: -10,
    duration: o.duration,
    stagger: o.stagger,
    ease: o.ease,
    repeat: -1,
    yoyo: true,
  })
  onComplete?.() // @internal
  return () => {
    tl.kill()
    split.revert()
  }
  // #endregion body
}
