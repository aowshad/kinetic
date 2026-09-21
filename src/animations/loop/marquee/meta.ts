import type { AnimationModule } from '../../../lib/types'
import { run } from './gsap'

const marquee: AnimationModule = {
  id: 'marquee', name: 'Marquee', category: 'loop',
  roles: ['heading', 'label', 'paragraph'], tags: ['ticker'],
  blurb: 'Text scrolls sideways in an endless, seamless ticker.',
  defaults: { duration: 3, stagger: 0, delay: 0, ease: 'none' },
  plugins: [],
  vanilla: 'none',
  impl: { gsap: run },
}

export default marquee
