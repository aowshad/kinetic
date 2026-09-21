import { gsap } from '../../lib/gsap'
import type { AnimationModule } from '../../lib/types'

const run: AnimationModule['run'] = (el, o, onComplete) => {
  // #region body
  el.style.display = 'inline-block'
  const tl = gsap.timeline({ delay: o.delay, repeat: -1, yoyo: true })
  tl.to(el, { scale: 1.08, opacity: 0.85, duration: o.duration, ease: o.ease })
  onComplete?.() // @internal
  return () => {
    tl.kill()
    gsap.set(el, { clearProps: 'scale,opacity' })
    el.style.display = ''
  }
  // #endregion body
}
const pulseLoop: AnimationModule = {
  id: 'pulse-loop', name: 'Pulse Loop', category: 'loop',
  roles: ['heading', 'label', 'button'], tags: ['pulse'],
  blurb: 'Text breathes with a soft, uniform pulse, forever.',
  defaults: { duration: 0.8, stagger: 0, delay: 0, ease: 'sine.inOut' },
  plugins: [], run,
}

export default pulseLoop
