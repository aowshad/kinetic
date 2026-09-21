import type { AnimationModule } from '../../../lib/types'
import { run } from './gsap'

const scrollFadeStagger: AnimationModule = {
  id: 'scroll-fade-stagger', name: 'Scroll Fade Stagger', category: 'scroll',
  roles: ['heading', 'paragraph'], tags: ['scrub', 'split'],
  blurb: 'Characters rise and fade in one after another as you scroll.',
  defaults: { duration: 0.6, stagger: 0.03, delay: 0, ease: 'power2.out' },
  plugins: ['SplitText', 'ScrollTrigger'],
  vanilla: 'none',
  impl: { gsap: run },
}

export default scrollFadeStagger
