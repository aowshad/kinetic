import type { AnimationModule } from '../../../lib/types'
import { run } from './gsap'

const wordFadeUp: AnimationModule = {
  id: 'word-fade-up',
  name: 'Word Fade Up',
  category: 'entrance',
  roles: ['heading', 'paragraph', 'label'],
  tags: ['split', 'words'],
  blurb: 'Each word rises up and fades in, staggered left to right.',
  defaults: { duration: 0.6, stagger: 0.06, delay: 0, ease: 'power3.out' },
  plugins: ['SplitText'],
  vanilla: 'none',
  impl: { gsap: run },
}

export default wordFadeUp
