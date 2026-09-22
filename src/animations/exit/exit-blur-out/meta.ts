import type { AnimationModule } from '../../../lib/types'
import { run } from './gsap'
import { run as vanillaRun } from './vanilla'

const exitBlurOut: AnimationModule = {
  id: 'exit-blur-out', name: 'Exit Blur Out', category: 'exit',
  roles: ['heading', 'paragraph', 'label'], tags: ['blur'],
  blurb: 'Text softens out of focus and fades away.',
  defaults: { duration: 0.5, stagger: 0, delay: 0, ease: 'power2.in' },
  plugins: [],
  vanilla: 'full',
  impl: { gsap: run, vanilla: vanillaRun },
}

export default exitBlurOut
