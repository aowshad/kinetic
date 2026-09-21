import type { AnimationModule } from '../../../lib/types'
import { run } from './gsap'

const scrollRotateIn: AnimationModule = {
  id: 'scroll-rotate-in', name: 'Scroll Rotate In', category: 'scroll',
  roles: ['heading', 'label'], tags: ['scrub', 'split', 'rotate'],
  blurb: 'Characters tumble upright one after another as you scroll.',
  defaults: { duration: 0.5, stagger: 0.04, delay: 0, ease: 'power2.out' },
  plugins: ['SplitText', 'ScrollTrigger'],
  vanilla: 'none',
  impl: { gsap: run },
}

export default scrollRotateIn
