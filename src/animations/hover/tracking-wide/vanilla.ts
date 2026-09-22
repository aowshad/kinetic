import { LINEAR_EASE_MAP } from '../../../lib/linearEases'
import type { AnimationImpl } from '../../../lib/types'

export const run: AnimationImpl = (el, o) => {
  // #region body
  el.style.display = 'inline-block'
  const easing = LINEAR_EASE_MAP[o.ease] ?? 'linear'
  let current: Animation | null = null
  const animateTo = (letterSpacing: string) => {
    const from = getComputedStyle(el).letterSpacing
    current?.cancel()
    current = el.animate([{ letterSpacing: from }, { letterSpacing }], {
      duration: o.duration * 1000,
      easing,
      fill: 'forwards',
    })
  }
  const enter = () => animateTo('0.14em')
  const leave = () => animateTo('0em')
  const ons = [['pointerenter', enter], ['pointerleave', leave], ['focus', enter], ['blur', leave]] as const
  ons.forEach(([e, fn]) => el.addEventListener(e, fn))
  return () => {
    current?.cancel()
    ons.forEach(([e, fn]) => el.removeEventListener(e, fn))
    el.style.display = ''
  }
  // #endregion body
}
