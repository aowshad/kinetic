import type { AnimationModule } from '../../../lib/types'
import { run } from './gsap'
import { run as vanillaRun } from './vanilla'

const bounceLoop: AnimationModule = {
  id: 'bounce-loop', name: 'Bounce Loop', category: 'loop',
  roles: ['heading', 'label', 'button'], tags: ['bounce'],
  blurb: 'Text bounces up and down endlessly, like a ball at rest.',
  defaults: { duration: 0.6, stagger: 0, delay: 0, ease: 'bounce.out' },
  plugins: [],
  vanilla: 'full',
  impl: { gsap: run, vanilla: vanillaRun },
}

export default bounceLoop
