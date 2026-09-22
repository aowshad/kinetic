import { LINEAR_EASE_MAP } from '../../../lib/linearEases'
import type { AnimationImpl } from '../../../lib/types'

export const run: AnimationImpl = (el, o) => {
  // #region body
  el.style.position = 'relative'
  el.style.display = 'inline-block'
  const line = document.createElement('span')
  line.className = 'k-underline'
  line.setAttribute('aria-hidden', 'true')
  el.append(line)
  const easing = LINEAR_EASE_MAP[o.ease] ?? 'linear'
  let current: Animation | null = null // @emit: let current = null
  const animateTo = (scaleX: number) => { // @emit: const animateTo = (scaleX) => {
    const from = getComputedStyle(line).transform
    current?.cancel()
    current = line.animate([{ transform: from }, { transform: `scaleX(${scaleX})` }], {
      duration: o.duration * 1000,
      easing,
      fill: 'forwards',
    })
  }
  const enter = () => animateTo(1)
  const leave = () => animateTo(0)
  const ons = [['pointerenter', enter], ['pointerleave', leave], ['focus', enter], ['blur', leave]] as const
  ons.forEach(([e, fn]) => el.addEventListener(e, fn))
  return () => {
    current?.cancel()
    ons.forEach(([e, fn]) => el.removeEventListener(e, fn))
    line.remove()
    el.style.position = ''
    el.style.display = ''
  }
  // #endregion body
}
