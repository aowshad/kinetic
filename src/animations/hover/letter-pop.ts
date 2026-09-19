import { gsap, SplitText } from '../../lib/gsap'
import type { AnimationModule } from '../../lib/types'

const run: AnimationModule['run'] = (el, o) => {
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
const letterPop: AnimationModule = {
  id: 'letter-pop', name: 'Letter Pop', category: 'hover',
  roles: ['heading', 'label', 'button'], tags: ['hover', 'split'],
  blurb: 'Hover or focus to pop each character up and back with a bounce.',
  defaults: { duration: 0.4, stagger: 0.03, delay: 0, ease: 'back.out(3)' },
  plugins: ['SplitText'], run,
}
export default letterPop
