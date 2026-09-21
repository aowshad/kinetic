import type { AnimationModule } from '../../../lib/types'
import { run } from './gsap'

const dropBounce: AnimationModule = {
  id: 'drop-bounce', name: 'Drop Bounce', category: 'entrance',
  roles: ['heading', 'label'], tags: ['split', 'bounce'],
  blurb: 'Characters drop from above and bounce into place.',
  defaults: { duration: 0.8, stagger: 0.04, delay: 0, ease: 'bounce.out' },
  plugins: ['SplitText'],
  vanilla: 'none',
  impl: { gsap: run },
}

export default dropBounce
