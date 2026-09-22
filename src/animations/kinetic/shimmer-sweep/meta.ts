import type { AnimationModule } from '../../../lib/types'
import { run } from './gsap'
import { run as vanillaRun } from './vanilla'

const shimmerSweep: AnimationModule = {
  id: 'shimmer-sweep', name: 'Shimmer Sweep', category: 'kinetic',
  roles: ['heading', 'label', 'button'], tags: ['loop', 'shine'],
  blurb: 'A soft band of light sweeps across the text on an endless loop.',
  defaults: { duration: 2, stagger: 0, delay: 0, ease: 'none' },
  plugins: [],
  vanilla: 'full',
  impl: { gsap: run, vanilla: vanillaRun },
}

export default shimmerSweep
