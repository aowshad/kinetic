import { gsap } from '../../lib/gsap'
import type { AnimationModule } from '../../lib/types'

const run: AnimationModule['run'] = (el, o, onComplete) => {
  // #region body
  return gsap.timeline({ delay: o.delay }).to(el, {
    opacity: 0,
    y: 24,
    duration: o.duration,
    ease: o.ease,
    onComplete, // @internal
  })
  // #endregion body
}
const exitFadeDown: AnimationModule = {
  id: 'exit-fade-down', name: 'Exit Fade Down', category: 'exit',
  roles: ['heading', 'paragraph', 'button', 'label'], tags: ['fade'],
  blurb: 'Text fades away as it drifts gently downward.',
  defaults: { duration: 0.5, stagger: 0, delay: 0, ease: 'power2.in' },
  plugins: [], run,
}

export default exitFadeDown
