import type { AnimationModule } from '../../../lib/types'
import { run } from './gsap'

const centerOut: AnimationModule = {
  id: 'center-out', name: 'Center Out', category: 'entrance',
  roles: ['heading', 'label'], tags: ['split', 'stagger'],
  blurb: 'Characters fade in outward from the center.',
  defaults: { duration: 0.4, stagger: 0.03, delay: 0, ease: 'power2.out' },
  plugins: ['SplitText'],
  vanilla: 'none',
  impl: { gsap: run },
}

export default centerOut
