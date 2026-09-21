import { gsap } from '../../lib/gsap'
import type { AnimationModule } from '../../lib/types'

const run: AnimationModule['run'] = (el, o) => {
  // #region body
  const text = el.textContent ?? ''
  let tl: gsap.core.Tween | null = null // @emit: let tl = null
  const enter = () => {
    tl?.kill()
    tl = gsap.to(el, { duration: o.duration, scrambleText: { text, chars: 'upperCase', revealDelay: 0.2 }, ease: o.ease })
  }
  const leave = () => {
    tl?.kill()
    el.textContent = text
  }
  const ons = [['pointerenter', enter], ['pointerleave', leave], ['focus', enter], ['blur', leave]] as const
  ons.forEach(([e, fn]) => el.addEventListener(e, fn))
  return () => {
    tl?.kill()
    ons.forEach(([e, fn]) => el.removeEventListener(e, fn))
    el.textContent = text
  }
  // #endregion body
}
const charScramble: AnimationModule = {
  id: 'char-scramble', name: 'Char Scramble', category: 'hover',
  roles: ['button', 'link', 'label'], tags: ['hover', 'scramble'],
  blurb: 'Hover or focus to scramble the text before it decodes back.',
  defaults: { duration: 0.5, stagger: 0, delay: 0, ease: 'none' },
  plugins: ['ScrambleTextPlugin'], run,
}
export default charScramble
