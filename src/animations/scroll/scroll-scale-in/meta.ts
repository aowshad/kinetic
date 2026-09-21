import type { AnimationModule } from '../../../lib/types'
import { run } from './gsap'

const scrollScaleIn: AnimationModule = {
  id: 'scroll-scale-in', name: 'Scroll Scale In', category: 'scroll',
  roles: ['heading', 'button', 'label'], tags: ['scrub', 'scale'],
  blurb: 'Text scales up to full size as it scrolls to the center of the screen.',
  defaults: { duration: 1, stagger: 0, delay: 0, ease: 'none' },
  plugins: ['ScrollTrigger'],
  vanilla: 'none',
  impl: { gsap: run },
}

export default scrollScaleIn
