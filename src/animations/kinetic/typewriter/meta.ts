import type { AnimationModule } from '../../../lib/types'
import { run } from './gsap'

const typewriter: AnimationModule = {
  id: 'typewriter', name: 'Typewriter', category: 'kinetic',
  roles: ['heading', 'label', 'paragraph'], tags: ['text', 'plugin'],
  blurb: 'Text types itself out with a blinking caret.',
  defaults: { duration: 1.5, stagger: 0, delay: 0, ease: 'none' },
  plugins: ['TextPlugin'],
  vanilla: 'none',
  impl: { gsap: run },
}

export default typewriter
