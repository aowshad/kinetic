import { gsap } from '../../../lib/gsap'
import type { AnimationImpl } from '../../../lib/types'

export const run: AnimationImpl = (el, o) => {
  // #region body
  const text = el.textContent ?? ''
  el.setAttribute('aria-label', text); el.innerHTML = ''
  const inner = document.createElement('span')
  inner.className = 'k-roll-inner'
  inner.append(
    ...[0, 1].map((i) => {
      const row = document.createElement('span')
      row.textContent = text
      if (i) row.style.color = 'var(--accent)'
      return row
    }),
  )
  const roll = document.createElement('span')
  roll.className = 'k-roll'
  roll.setAttribute('aria-hidden', 'true')
  roll.append(inner)
  el.append(roll)
  const enter = () => gsap.to(inner, { yPercent: -50, duration: o.duration, ease: o.ease, overwrite: true })
  const leave = () => gsap.to(inner, { yPercent: 0, duration: o.duration, ease: o.ease, overwrite: true })
  const ons = [['pointerenter', enter], ['pointerleave', leave], ['focus', enter], ['blur', leave]] as const
  ons.forEach(([e, fn]) => el.addEventListener(e, fn))
  return () => {
    gsap.killTweensOf(inner)
    ons.forEach(([e, fn]) => el.removeEventListener(e, fn))
    el.textContent = text
  }
  // #endregion body
}
