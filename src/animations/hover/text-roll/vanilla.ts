import { LINEAR_EASE_MAP } from '../../../lib/linearEases'
import type { AnimationImpl } from '../../../lib/types'

export const run: AnimationImpl = (el, o) => {
  // #region body
  const text = el.textContent ?? ''
  el.setAttribute('aria-label', text)
  el.innerHTML = ''
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
  const easing = LINEAR_EASE_MAP[o.ease] ?? 'linear'
  let current: Animation | null = null // @emit: let current = null
  const animateTo = (yPercent: number) => { // @emit: const animateTo = (yPercent) => {
    const from = getComputedStyle(inner).transform
    current?.cancel()
    current = inner.animate([{ transform: from }, { transform: `translateY(${yPercent}%)` }], {
      duration: o.duration * 1000,
      easing,
      fill: 'forwards',
    })
  }
  const enter = () => animateTo(-50)
  const leave = () => animateTo(0)
  const ons = [['pointerenter', enter], ['pointerleave', leave], ['focus', enter], ['blur', leave]] as const
  ons.forEach(([e, fn]) => el.addEventListener(e, fn))
  return () => {
    current?.cancel()
    ons.forEach(([e, fn]) => el.removeEventListener(e, fn))
    el.textContent = text
  }
  // #endregion body
}
