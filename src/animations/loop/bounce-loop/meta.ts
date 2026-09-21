import type { AnimationModule } from '../../../lib/types'
import { run } from './gsap'

const bounceLoop: AnimationModule = {
  id: 'bounce-loop', name: 'Bounce Loop', category: 'loop',
  roles: ['heading', 'label', 'button'], tags: ['bounce'],
  blurb: 'Text bounces up and down endlessly, like a ball at rest.',
  defaults: { duration: 0.6, stagger: 0, delay: 0, ease: 'bounce.out' },
  plugins: [],
  vanilla: 'none',
  impl: { gsap: run },
}

export default bounceLoop
