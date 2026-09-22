import type { AnimationModule } from '../../../lib/types'
import { run } from './gsap'
import { run as vanillaRun } from './vanilla'

const exitFadeDown: AnimationModule = {
  id: 'exit-fade-down', name: 'Exit Fade Down', category: 'exit',
  roles: ['heading', 'paragraph', 'button', 'label'], tags: ['fade'],
  blurb: 'Text fades away as it drifts gently downward.',
  defaults: { duration: 0.5, stagger: 0, delay: 0, ease: 'power2.in' },
  plugins: [],
  vanilla: 'full',
  impl: { gsap: run, vanilla: vanillaRun },
}

export default exitFadeDown
