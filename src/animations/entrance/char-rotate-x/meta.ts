import type { AnimationModule } from '../../../lib/types'
import { run } from './gsap'
import { run as vanillaRun } from './vanilla'

const charRotateX: AnimationModule = {
  id: 'char-rotate-x', name: 'Char Rotate X', category: 'entrance',
  roles: ['heading', 'label'], tags: ['split', '3d'],
  blurb: 'Characters flip up from a backward tilt into place.',
  defaults: { duration: 0.6, stagger: 0.03, delay: 0, ease: 'back.out(1.7)' },
  plugins: ['SplitText'],
  reducedMotion: 'settle',
  vanilla: 'full',
  impl: { gsap: run, vanilla: vanillaRun },
}

export default charRotateX
