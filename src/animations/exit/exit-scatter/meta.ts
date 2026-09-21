import type { AnimationModule } from '../../../lib/types'
import { run } from './gsap'

const exitScatter: AnimationModule = {
  id: 'exit-scatter', name: 'Exit Scatter', category: 'exit',
  roles: ['heading', 'label'], tags: ['split', 'scatter'],
  blurb: 'Characters scatter outward in every direction and vanish.',
  defaults: { duration: 0.5, stagger: 0.03, delay: 0, ease: 'power2.in' },
  plugins: ['SplitText'],
  vanilla: 'none',
  impl: { gsap: run },
}

export default exitScatter
