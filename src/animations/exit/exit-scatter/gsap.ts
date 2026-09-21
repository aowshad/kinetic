import { gsap, SplitText } from '../../../lib/gsap'
import type { AnimationImpl } from '../../../lib/types'

export const run: AnimationImpl = (el, o, onComplete) => {
  // #region body
  el.setAttribute('aria-label', el.textContent ?? '')
  const split = new SplitText(el, { type: 'chars', charsClass: 'k-char' })
  const tl = gsap.timeline({ delay: o.delay })
  split.chars.forEach((c, i) => {
    const angle = (i / split.chars.length) * Math.PI * 2
    tl.to(
      c,
      {
        x: Math.cos(angle) * 60,
        y: Math.sin(angle) * 60,
        rotation: (i % 2 ? 1 : -1) * 45,
        opacity: 0,
        duration: o.duration,
        ease: o.ease,
      },
      i * o.stagger,
    )
  })
  tl.call(() => onComplete?.()) // @internal
  return () => {
    tl.kill()
    split.revert()
  }
  // #endregion body
}
