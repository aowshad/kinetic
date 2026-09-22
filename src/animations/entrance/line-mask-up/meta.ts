import type { AnimationModule } from '../../../lib/types'
import { run } from './gsap'
import { run as vanillaRun } from './vanilla'

const lineMaskUp: AnimationModule = {
  id: 'line-mask-up', name: 'Line Mask Up', category: 'entrance',
  roles: ['paragraph', 'heading'], tags: ['split', 'lines', 'mask'],
  blurb: 'Each line slides up from behind a clipped mask.',
  defaults: { duration: 0.7, stagger: 0.12, delay: 0, ease: 'power4.out' },
  plugins: ['SplitText'],
  vanilla: 'full',
  impl: { gsap: run, vanilla: vanillaRun },
}

export default lineMaskUp
