import type { AnimationModule } from '../../../lib/types'
import { run } from './gsap'

const counterRoll: AnimationModule = {
  id: 'counter-roll', name: 'Counter Roll', category: 'kinetic',
  roles: ['counter'], tags: ['number'],
  blurb: 'Digits count up from zero to the target number. Type a number as the sample text to try it.',
  defaults: { duration: 1.2, stagger: 0, delay: 0, ease: 'power2.out' },
  plugins: [],
  vanilla: 'none',
  impl: { gsap: run },
}

export default counterRoll
