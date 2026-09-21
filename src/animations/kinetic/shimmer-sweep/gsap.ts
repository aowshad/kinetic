import { gsap } from '../../../lib/gsap'
import type { AnimationImpl } from '../../../lib/types'

export const run: AnimationImpl = (el, o, onComplete) => {
  // #region body
  el.classList.add('k-shimmer')
  const tl = gsap.timeline({ delay: o.delay, repeat: -1 })
  tl.fromTo(el, { backgroundPosition: '150% 0' }, { backgroundPosition: '-50% 0', duration: o.duration, ease: o.ease })
  onComplete?.() // @internal
  return () => {
    tl.kill()
    el.classList.remove('k-shimmer')
    gsap.set(el, { clearProps: 'backgroundPosition' })
  }
  // #endregion body
}
