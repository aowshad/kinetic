import type { AnimationModule } from '../../../lib/types'
import { run } from './gsap'

const scrollRevealMask: AnimationModule = {
  id: 'scroll-reveal-mask', name: 'Scroll Reveal Mask', category: 'scroll',
  roles: ['heading', 'paragraph', 'label'], tags: ['scrub', 'mask'],
  blurb: 'A mask wipes open across the text as you scroll it into view.',
  defaults: { duration: 1, stagger: 0, delay: 0, ease: 'none' },
  plugins: ['ScrollTrigger'],
  vanilla: 'none',
  impl: { gsap: run },
}

export default scrollRevealMask
