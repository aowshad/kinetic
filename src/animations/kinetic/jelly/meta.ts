import type { AnimationModule } from '../../../lib/types'
import { run } from './gsap'

const jelly: AnimationModule = {
  id: 'jelly', name: 'Jelly', category: 'kinetic',
  roles: ['heading', 'label', 'button'], tags: ['loop', 'elastic'],
  blurb: 'The whole word squashes and stretches like jelly, endlessly.',
  defaults: { duration: 0.5, stagger: 0, delay: 0, ease: 'elastic.out(1, 0.3)' },
  plugins: [],
  vanilla: 'none',
  impl: { gsap: run },
}

export default jelly
