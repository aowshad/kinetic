import { gsap } from '../../../lib/gsap'
import type { AnimationImpl } from '../../../lib/types'

export const run: AnimationImpl = (el, o) => {
  // #region body
  el.style.position = 'relative'
  el.style.display = 'inline-block'
  const line = document.createElement('span')
  line.className = 'k-underline'
  line.setAttribute('aria-hidden', 'true')
  el.append(line)
  const enter = () => gsap.to(line, { scaleX: 1, duration: o.duration, ease: o.ease, overwrite: true })
  const leave = () => gsap.to(line, { scaleX: 0, duration: o.duration, ease: o.ease, overwrite: true })
  const ons = [['pointerenter', enter], ['pointerleave', leave], ['focus', enter], ['blur', leave]] as const
  ons.forEach(([e, fn]) => el.addEventListener(e, fn))
  return () => {
    gsap.killTweensOf(line)
    ons.forEach(([e, fn]) => el.removeEventListener(e, fn))
    line.remove()
    el.style.position = ''
    el.style.display = ''
  }
  // #endregion body
}
