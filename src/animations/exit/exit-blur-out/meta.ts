import type { AnimationModule } from '../../../lib/types'
import { run } from './gsap'

const exitBlurOut: AnimationModule = {
  id: 'exit-blur-out', name: 'Exit Blur Out', category: 'exit',
  roles: ['heading', 'paragraph', 'label'], tags: ['blur'],
  blurb: 'Text softens out of focus and fades away.',
  defaults: { duration: 0.5, stagger: 0, delay: 0, ease: 'power2.in' },
  plugins: [],
  vanilla: 'none',
  impl: { gsap: run },
}

export default exitBlurOut
