import type { AnimationModule } from '../../../lib/types'
import { run } from './gsap'
import { run as vanillaRun } from './vanilla'

const wave: AnimationModule = {
  id: 'wave', name: 'Wave', category: 'kinetic',
  roles: ['heading', 'label'], tags: ['loop', 'split'],
  blurb: 'Characters ripple up and down in an endless wave.',
  defaults: { duration: 0.5, stagger: 0.04, delay: 0, ease: 'sine.inOut' },
  plugins: ['SplitText'],
  vanilla: 'full',
  impl: { gsap: run, vanilla: vanillaRun },
}

export default wave
