import { gsap } from '../../../lib/gsap'
import type { AnimationImpl } from '../../../lib/types'

export const run: AnimationImpl = (el, o) => {
  // #region body
  const text = el.textContent ?? ''
  let tl: gsap.core.Tween | null = null // @emit: let tl = null
  const enter = () => {
    tl?.kill()
    tl = gsap.to(el, { duration: o.duration, scrambleText: { text, chars: 'upperCase', revealDelay: 0.2 }, ease: o.ease })
  }
  const leave = () => {
    tl?.kill()
    el.textContent = text
  }
  const ons = [['pointerenter', enter], ['pointerleave', leave], ['focus', enter], ['blur', leave]] as const
  ons.forEach(([e, fn]) => el.addEventListener(e, fn))
  return () => {
    tl?.kill()
    ons.forEach(([e, fn]) => el.removeEventListener(e, fn))
    el.textContent = text
  }
  // #endregion body
}
