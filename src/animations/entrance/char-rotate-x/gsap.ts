import { gsap, SplitText } from '../../../lib/gsap'
import type { AnimationImpl } from '../../../lib/types'

export const run: AnimationImpl = (el, o, onComplete) => {
  // #region body
  el.setAttribute('aria-label', el.textContent ?? '')
  el.style.perspective = '800px'
  const split = new SplitText(el, { type: 'words,chars', wordsClass: 'k-word', charsClass: 'k-char' })
  split.words.forEach((w) => w.setAttribute('aria-hidden', 'true'))
  gsap.set(split.chars, { transformOrigin: '50% 50% -60px' })
  const tl = gsap.timeline({ delay: o.delay })
  tl.from(split.chars, {
    rotationX: -90,
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
