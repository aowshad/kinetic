import type { AnimationModule } from '../../../lib/types'
import { run } from './gsap'
import { run as vanillaRun } from './vanilla'

const scalePop: AnimationModule = {
  id: 'scale-pop', name: 'Scale Pop', category: 'entrance',
  roles: ['heading', 'label', 'button'], tags: ['split', 'scale'],
  blurb: 'Characters pop in from nothing in a random order.',
  defaults: { duration: 0.5, stagger: 0.03, delay: 0, ease: 'back.out(2)' },
  plugins: ['SplitText'],
  vanilla: 'full',
  impl: { gsap: run, vanilla: vanillaRun },
}

export default scalePop
