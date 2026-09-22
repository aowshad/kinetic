import { LINEAR_EASE_MAP } from '../../../lib/linearEases'
import type { AnimationImpl } from '../../../lib/types'

export const run: AnimationImpl = (el, o) => {
  // #region body
  el.style.display = 'inline-block'
  const easing = LINEAR_EASE_MAP[o.ease] ?? 'linear'
  let current: Animation | null = null // @emit: let current = null
  const animateTo = (transform: string) => { // @emit: const animateTo = (transform) => {
    const from = getComputedStyle(el).transform
    current?.cancel()
    current = el.animate([{ transform: from }, { transform }], {
      duration: o.duration * 1000,
      easing,
      fill: 'forwards',
    })
  }
  const enter = () => animateTo('translateX(6px) skewX(-8deg)')
  const leave = () => animateTo('none')
  const ons = [['pointerenter', enter], ['pointerleave', leave], ['focus', enter], ['blur', leave]] as const
  ons.forEach(([e, fn]) => el.addEventListener(e, fn))
  return () => {
    current?.cancel()
    ons.forEach(([e, fn]) => el.removeEventListener(e, fn))
    el.style.display = ''
  }
  // #endregion body
}
