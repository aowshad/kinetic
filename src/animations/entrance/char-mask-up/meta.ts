import type { AnimationModule } from '../../../lib/types'
import { run } from './gsap'

const charMaskUp: AnimationModule = {
  id: 'char-mask-up', name: 'Char Mask Up', category: 'entrance',
  roles: ['heading', 'label'], tags: ['split', 'chars', 'mask'],
  blurb: 'Each character slides up from behind a tight clipping mask.',
  defaults: { duration: 0.5, stagger: 0.025, delay: 0, ease: 'expo.out' },
  plugins: ['SplitText'],
  vanilla: 'none',
  impl: { gsap: run },
}

export default charMaskUp
