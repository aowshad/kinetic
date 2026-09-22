import { LINEAR_EASE_MAP } from '../../../lib/linearEases'
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
  fill.style.clipPath = 'inset(0 100% 0 0)'
  const easing = LINEAR_EASE_MAP[o.ease] ?? 'linear'
  let current: Animation | null = null
  const animateTo = (rightInset: number) => {
    const from = getComputedStyle(fill).clipPath
    current?.cancel()
    current = fill.animate([{ clipPath: from }, { clipPath: `inset(0 ${rightInset}% 0 0)` }], {
      duration: o.duration * 1000,
      easing,
      fill: 'forwards',
    })
  }
  const enter = () => animateTo(0)
  const leave = () => animateTo(100)
  const ons = [['pointerenter', enter], ['pointerleave', leave], ['focus', enter], ['blur', leave]] as const
  ons.forEach(([e, fn]) => el.addEventListener(e, fn))
  return () => {
    current?.cancel()
    ons.forEach(([e, fn]) => el.removeEventListener(e, fn))
    fill.remove()
    el.style.position = ''
  }
  // #endregion body
}
