import type { AnimationModule } from '../../../lib/types'
import { run } from './gsap'
import { run as vanillaRun } from './vanilla'

const blurIn: AnimationModule = {
  id: 'blur-in',
  name: 'Blur In',
  category: 'entrance',
  roles: ['heading', 'paragraph', 'label'],
  tags: ['split', 'blur'],
  blurb: 'Characters sharpen into focus as they fade in from a blur.',
  defaults: { duration: 0.5, stagger: 0.02, delay: 0, ease: 'power2.out' },
  plugins: ['SplitText'],
  vanilla: 'full',
  impl: { gsap: run, vanilla: vanillaRun },
}

export default blurIn
