import { gsap } from '../../lib/gsap'
import type { AnimationModule } from '../../lib/types'

const run: AnimationModule['run'] = (el, o, onComplete) => {
  // #region body
  return gsap.timeline({ delay: o.delay }).to(el, {
    opacity: 0,
    filter: 'blur(10px)',
    duration: o.duration,
    ease: o.ease,
    onComplete, // @internal
  })
  // #endregion body
}
const exitBlurOut: AnimationModule = {
  id: 'exit-blur-out', name: 'Exit Blur Out', category: 'exit',
  roles: ['heading', 'paragraph', 'label'], tags: ['blur'],
  blurb: 'Text softens out of focus and fades away.',
  defaults: { duration: 0.5, stagger: 0, delay: 0, ease: 'power2.in' },
  plugins: [], run,
}

export default exitBlurOut
