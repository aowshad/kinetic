import { gsap, SplitText } from '../../lib/gsap'
import type { AnimationModule } from '../../lib/types'

const run: AnimationModule['run'] = (el, o) => {
  // #region body
  el.setAttribute('aria-label', el.textContent ?? '')
  const split = new SplitText(el, { type: 'words,chars', wordsClass: 'k-word', charsClass: 'k-char' })
  split.words.forEach((w) => w.setAttribute('aria-hidden', 'true'))
  let tl: gsap.core.Tween | null = null // @emit: let tl = null
  const enter = () => {
    tl?.kill()
    tl = gsap.to(split.chars, {
      y: -8,
      duration: o.duration,
      stagger: { each: o.stagger, from: 'start' },
      ease: o.ease,
      repeat: -1,
      yoyo: true,
    })
  }
  const leave = () => {
    tl?.kill()
    tl = gsap.to(split.chars, { y: 0, duration: o.duration, ease: o.ease, overwrite: true })
  }
  const ons = [['pointerenter', enter], ['pointerleave', leave], ['focus', enter], ['blur', leave]] as const
  ons.forEach(([e, fn]) => el.addEventListener(e, fn))
  return () => {
    tl?.kill()
    ons.forEach(([e, fn]) => el.removeEventListener(e, fn))
    split.revert()
  }
  // #endregion body
}
const charRipple: AnimationModule = {
  id: 'char-ripple', name: 'Char Ripple', category: 'hover',
  roles: ['heading', 'label'], tags: ['hover', 'split', 'loop'],
  blurb: 'Hover or focus to send an endless ripple through the characters.',
  defaults: { duration: 0.45, stagger: 0.035, delay: 0, ease: 'sine.inOut' },
  plugins: ['SplitText'], run,
}
export default charRipple
