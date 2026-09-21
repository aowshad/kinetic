import type { AnimationModule } from '../../../lib/types'
import { run } from './gsap'

const weightMorph: AnimationModule = {
  id: 'weight-morph', name: 'Weight Morph', category: 'kinetic',
  roles: ['heading', 'label'], tags: ['loop', 'weight'],
  blurb: 'Text breathes between light and bold weight, endlessly.',
  defaults: { duration: 0.9, stagger: 0, delay: 0, ease: 'sine.inOut' },
  plugins: [],
  vanilla: 'none',
  impl: { gsap: run },
}

export default weightMorph
