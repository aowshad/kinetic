import type { AnimationModule } from '../../../lib/types'
import { run } from './gsap'
import { run as vanillaRun } from './vanilla'

const centerOut: AnimationModule = {
  id: 'center-out', name: 'Center Out', category: 'entrance',
  roles: ['heading', 'label'], tags: ['split', 'stagger'],
  blurb: 'Characters fade in outward from the center.',
  defaults: { duration: 0.4, stagger: 0.03, delay: 0, ease: 'power2.out' },
  plugins: ['SplitText'],
  reducedMotion: 'settle',
  vanilla: 'full',
  impl: { gsap: run, vanilla: vanillaRun },
}

export default centerOut
