import { gsap, SplitText } from '../../../lib/gsap'
import type { AnimationImpl } from '../../../lib/types'

export const run: AnimationImpl = (el, o) => {
  // #region body
  el.setAttribute('aria-label', el.textContent ?? '')
  const split = new SplitText(el, { type: 'words,chars', wordsClass: 'k-word', charsClass: 'k-char' })
  split.words.forEach((w) => w.setAttribute('aria-hidden', 'true'))
  const enter = () =>
    gsap.to(split.chars, { scale: 1.3, y: -6, duration: o.duration, stagger: o.stagger, ease: o.ease, overwrite: true })
  const leave = () =>
    gsap.to(split.chars, { scale: 1, y: 0, duration: o.duration, stagger: o.stagger, ease: o.ease, overwrite: true })
  const ons = [['pointerenter', enter], ['pointerleave', leave], ['focus', enter], ['blur', leave]] as const
  ons.forEach(([e, fn]) => el.addEventListener(e, fn))
  return () => {
    gsap.killTweensOf(split.chars)
    ons.forEach(([e, fn]) => el.removeEventListener(e, fn))
    split.revert()
  }
  // #endregion body
}
