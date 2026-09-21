import type { AnimationModule } from '../../../lib/types'
import { run } from './gsap'

const charRipple: AnimationModule = {
  id: 'char-ripple', name: 'Char Ripple', category: 'hover',
  roles: ['heading', 'label'], tags: ['hover', 'split', 'loop'],
  blurb: 'Hover or focus to send an endless ripple through the characters.',
  defaults: { duration: 0.45, stagger: 0.035, delay: 0, ease: 'sine.inOut' },
  plugins: ['SplitText'],
  vanilla: 'none',
  impl: { gsap: run },
}
export default charRipple
