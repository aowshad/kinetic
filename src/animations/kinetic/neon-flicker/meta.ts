import type { AnimationModule } from '../../../lib/types'
import { run } from './gsap'

const neonFlicker: AnimationModule = {
  id: 'neon-flicker', name: 'Neon Flicker', category: 'kinetic',
  roles: ['heading', 'label', 'button'], tags: ['loop', 'glow'],
  blurb: 'Text glows like a neon sign, flickering unevenly before it settles.',
  defaults: { duration: 0.1, stagger: 0, delay: 0, ease: 'steps(1)' },
  plugins: [],
  vanilla: 'none',
  impl: { gsap: run },
}

export default neonFlicker
