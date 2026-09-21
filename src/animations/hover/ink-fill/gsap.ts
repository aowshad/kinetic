import { gsap } from '../../../lib/gsap'
import type { AnimationImpl } from '../../../lib/types'

export const run: AnimationImpl = (el, o) => {
  // #region body
  const text = el.textContent ?? ''
  el.setAttribute('aria-label', text)
  el.style.position = 'relative'
  const fill = document.createElement('span')
  fill.textContent = text
  fill.className = 'k-ink-fill'
  fill.setAttribute('aria-hidden', 'true')
  el.append(fill)
  gsap.set(fill, { clipPath: 'inset(0 100% 0 0)' })
  const enter = () => gsap.to(fill, { clipPath: 'inset(0 0% 0 0)', duration: o.duration, ease: o.ease, overwrite: true })
  const leave = () => gsap.to(fill, { clipPath: 'inset(0 100% 0 0)', duration: o.duration, ease: o.ease, overwrite: true })
  const ons = [['pointerenter', enter], ['pointerleave', leave], ['focus', enter], ['blur', leave]] as const
  ons.forEach(([e, fn]) => el.addEventListener(e, fn))
  return () => {
    gsap.killTweensOf(fill)
    ons.forEach(([e, fn]) => el.removeEventListener(e, fn))
    fill.remove()
    el.style.position = ''
  }
  // #endregion body
}
