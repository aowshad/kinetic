import type { AnimationModule } from '../../../lib/types'
import { run } from './gsap'
import { run as vanillaRun } from './vanilla'

const glitch: AnimationModule = {
  id: 'glitch', name: 'Glitch', category: 'kinetic',
  roles: ['heading', 'label', 'button'], tags: ['glitch'],
  blurb: 'Red and cyan ghosts jitter apart before snapping back together.',
  defaults: { duration: 0.6, stagger: 0, delay: 0, ease: 'steps(6)' },
  plugins: [],
  vanilla: 'full',
  impl: { gsap: run, vanilla: vanillaRun },
}

export default glitch
