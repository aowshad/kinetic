import type { AnimationModule } from '../../../lib/types'
import { run } from './gsap'

const skewShift: AnimationModule = {
  id: 'skew-shift', name: 'Skew Shift', category: 'hover',
  roles: ['button', 'link', 'label'], tags: ['hover', 'skew'],
  blurb: 'Hover or focus to skew and nudge the text sideways.',
  defaults: { duration: 0.3, stagger: 0, delay: 0, ease: 'power3.out' },
  plugins: [],
  vanilla: 'none',
  impl: { gsap: run },
}
export default skewShift
