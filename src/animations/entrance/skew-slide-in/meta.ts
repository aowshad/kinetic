import type { AnimationModule } from '../../../lib/types'
import { run } from './gsap'

const skewSlideIn: AnimationModule = {
  id: 'skew-slide-in', name: 'Skew Slide In', category: 'entrance',
  roles: ['heading', 'paragraph', 'label'], tags: ['split', 'skew'],
  blurb: 'Each word slides in from the left with a skew.',
  defaults: { duration: 0.5, stagger: 0.05, delay: 0, ease: 'power3.out' },
  plugins: ['SplitText'],
  vanilla: 'none',
  impl: { gsap: run },
}

export default skewSlideIn
