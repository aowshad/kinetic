import type { AnimationModule } from '../../../lib/types'
import { run } from './gsap'
import { run as vanillaRun } from './vanilla'

const typewriter: AnimationModule = {
  id: 'typewriter', name: 'Typewriter', category: 'kinetic',
  roles: ['heading', 'label', 'paragraph'], tags: ['text', 'plugin'],
  blurb: 'Text types itself out with a blinking caret.',
  defaults: { duration: 1.5, stagger: 0, delay: 0, ease: 'none' },
  plugins: ['TextPlugin'],
  vanilla: 'full',
  impl: { gsap: run, vanilla: vanillaRun },
}

export default typewriter
