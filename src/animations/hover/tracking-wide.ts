import { gsap } from '../../lib/gsap'
import type { AnimationModule } from '../../lib/types'

const run: AnimationModule['run'] = (el, o) => {
  // #region body
  el.style.display = 'inline-block'
  const enter = () => gsap.to(el, { letterSpacing: '0.14em', duration: o.duration, ease: o.ease, overwrite: true })
  const leave = () => gsap.to(el, { letterSpacing: '0em', duration: o.duration, ease: o.ease, overwrite: true })
  const ons = [['pointerenter', enter], ['pointerleave', leave], ['focus', enter], ['blur', leave]] as const
  ons.forEach(([e, fn]) => el.addEventListener(e, fn))
  return () => {
    gsap.killTweensOf(el)
    ons.forEach(([e, fn]) => el.removeEventListener(e, fn))
    gsap.set(el, { clearProps: 'letterSpacing' })
    el.style.display = ''
  }
  // #endregion body
}
const trackingWide: AnimationModule = {
  id: 'tracking-wide', name: 'Tracking Wide', category: 'hover',
  roles: ['link', 'label', 'button'], tags: ['hover', 'tracking'],
  blurb: 'Hover or focus to spread the letters apart.',
  defaults: { duration: 0.35, stagger: 0, delay: 0, ease: 'power2.out' },
  plugins: [], run,
}
export default trackingWide
