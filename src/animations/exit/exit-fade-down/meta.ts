import type { AnimationModule } from '../../../lib/types'
import { run } from './gsap'

const exitFadeDown: AnimationModule = {
  id: 'exit-fade-down', name: 'Exit Fade Down', category: 'exit',
  roles: ['heading', 'paragraph', 'button', 'label'], tags: ['fade'],
  blurb: 'Text fades away as it drifts gently downward.',
  defaults: { duration: 0.5, stagger: 0, delay: 0, ease: 'power2.in' },
  plugins: [],
  vanilla: 'none',
  impl: { gsap: run },
}

export default exitFadeDown
