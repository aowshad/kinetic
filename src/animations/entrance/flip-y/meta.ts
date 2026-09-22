import type { AnimationModule } from '../../../lib/types'
import { run } from './gsap'
import { run as vanillaRun } from './vanilla'

const flipY: AnimationModule = {
  id: 'flip-y', name: 'Flip Y', category: 'entrance',
  roles: ['heading', 'label'], tags: ['split', '3d'],
  blurb: 'Characters flip in from alternating directions on the Y axis.',
  defaults: { duration: 0.5, stagger: 0.025, delay: 0, ease: 'power2.out' },
  plugins: ['SplitText'],
  vanilla: 'full',
  impl: { gsap: run, vanilla: vanillaRun },
}

export default flipY
