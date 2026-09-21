import { gsap } from '../../lib/gsap'
import type { AnimationModule } from '../../lib/types'

const run: AnimationModule['run'] = (el, o) => {
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
const inkFill: AnimationModule = {
  id: 'ink-fill', name: 'Ink Fill', category: 'hover',
  roles: ['heading', 'label', 'button'], tags: ['hover', 'fill'],
  blurb: 'Hover or focus to fill the text with accent color from left to right.',
  defaults: { duration: 0.4, stagger: 0, delay: 0, ease: 'power3.out' },
  plugins: [], run,
}
export default inkFill
