import { splitChars } from '../../../lib/splitChars'
import { LINEAR_EASE_MAP } from '../../../lib/linearEases'
import type { AnimationImpl } from '../../../lib/types'

export const run: AnimationImpl = (el, o) => {
  // #region body
  const split = splitChars(el)
  const easing = LINEAR_EASE_MAP[o.ease] ?? 'linear'
  let anims: Animation[] = []
  const animateTo = (transform: string) => {
    const froms = split.chars.map((c) => getComputedStyle(c).transform)
    anims.forEach((a) => a.cancel())
    anims = split.chars.map((c, i) =>
      c.animate([{ transform: froms[i] }, { transform }], {
        duration: o.duration * 1000,
        delay: i * o.stagger * 1000,
        easing,
        fill: 'forwards',
      }),
    )
  }
  const enter = () => animateTo('scale(1.3) translateY(-6px)')
  const leave = () => animateTo('none')
  const ons = [['pointerenter', enter], ['pointerleave', leave], ['focus', enter], ['blur', leave]] as const
  ons.forEach(([e, fn]) => el.addEventListener(e, fn))
  return () => {
    anims.forEach((a) => a.cancel())
    ons.forEach(([e, fn]) => el.removeEventListener(e, fn))
    split.revert()
  }
  // #endregion body
}
