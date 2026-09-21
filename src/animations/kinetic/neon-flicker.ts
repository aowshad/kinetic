import { gsap } from '../../lib/gsap'
import type { AnimationModule } from '../../lib/types'

const run: AnimationModule['run'] = (el, o, onComplete) => {
  // #region body
  el.classList.add('k-neon')
  const tl = gsap.timeline({ delay: o.delay, repeat: -1, repeatDelay: o.duration * 8 })
  tl.to(el, { opacity: 0.3, duration: o.duration, repeat: 5, yoyo: true, ease: o.ease })
  onComplete?.() // @internal
  return () => {
    tl.kill()
    el.classList.remove('k-neon')
    gsap.set(el, { clearProps: 'opacity' })
  }
  // #endregion body
}
const neonFlicker: AnimationModule = {
  id: 'neon-flicker', name: 'Neon Flicker', category: 'kinetic',
  roles: ['heading', 'label', 'button'], tags: ['loop', 'glow'],
  blurb: 'Text glows like a neon sign, flickering unevenly before it settles.',
  defaults: { duration: 0.1, stagger: 0, delay: 0, ease: 'steps(1)' },
  plugins: [], run,
}

export default neonFlicker
