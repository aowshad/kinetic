import type { AnimationModule } from '../../../lib/types'
import { run } from './gsap'

const scrollColorSweep: AnimationModule = {
  id: 'scroll-color-sweep', name: 'Scroll Color Sweep', category: 'scroll',
  roles: ['heading', 'paragraph', 'label'], tags: ['scrub', 'split', 'color'],
  blurb: 'Words pick up an accent color one by one as you scroll past them.',
  defaults: { duration: 0.5, stagger: 0.1, delay: 0, ease: 'none' },
  plugins: ['SplitText', 'ScrollTrigger'],
  vanilla: 'none',
  impl: { gsap: run },
}

export default scrollColorSweep
