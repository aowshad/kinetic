import type { AnimationModule } from '../../../lib/types'
import { run } from './gsap'

const trackingWide: AnimationModule = {
  id: 'tracking-wide', name: 'Tracking Wide', category: 'hover',
  roles: ['link', 'label', 'button'], tags: ['hover', 'tracking'],
  blurb: 'Hover or focus to spread the letters apart.',
  defaults: { duration: 0.35, stagger: 0, delay: 0, ease: 'power2.out' },
  plugins: [],
  vanilla: 'none',
  impl: { gsap: run },
}
export default trackingWide
