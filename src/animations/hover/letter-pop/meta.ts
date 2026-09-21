import type { AnimationModule } from '../../../lib/types'
import { run } from './gsap'

const letterPop: AnimationModule = {
  id: 'letter-pop', name: 'Letter Pop', category: 'hover',
  roles: ['heading', 'label', 'button'], tags: ['hover', 'split'],
  blurb: 'Hover or focus to pop each character up and back with a bounce.',
  defaults: { duration: 0.4, stagger: 0.03, delay: 0, ease: 'back.out(3)' },
  plugins: ['SplitText'],
  vanilla: 'none',
  impl: { gsap: run },
}
export default letterPop
