import { gsap, SplitText } from '../../../lib/gsap'
import type { AnimationImpl } from '../../../lib/types'

export const run: AnimationImpl = (el, o, onComplete) => {
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
