import type { AnimationModule } from '../../../lib/types'
import { run } from './gsap'

const charFadeUp: AnimationModule = {
  id: 'char-fade-up',
  name: 'Char Fade Up',
  category: 'entrance',
  roles: ['heading', 'paragraph', 'label'],
  tags: ['split', 'chars'],
  blurb: 'Each character rises up and fades in, staggered left to right.',
  defaults: { duration: 0.6, stagger: 0.02, delay: 0, ease: 'power3.out' },
  plugins: ['SplitText'],
  vanilla: 'none',
  impl: { gsap: run },
}

export default charFadeUp
