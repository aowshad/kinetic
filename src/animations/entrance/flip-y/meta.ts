import type { AnimationModule } from '../../../lib/types'
import { run } from './gsap'

const flipY: AnimationModule = {
  id: 'flip-y', name: 'Flip Y', category: 'entrance',
  roles: ['heading', 'label'], tags: ['split', '3d'],
  blurb: 'Characters flip in from alternating directions on the Y axis.',
  defaults: { duration: 0.5, stagger: 0.025, delay: 0, ease: 'power2.out' },
  plugins: ['SplitText'],
  vanilla: 'none',
  impl: { gsap: run },
}

export default flipY
