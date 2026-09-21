import type { AnimationModule } from '../../../lib/types'
import { run } from './gsap'

const scrollBlurFocus: AnimationModule = {
  id: 'scroll-blur-focus', name: 'Scroll Blur Focus', category: 'scroll',
  roles: ['heading', 'paragraph'], tags: ['scrub', 'blur'],
  blurb: 'Text sharpens into focus as it scrolls toward the center of the screen.',
  defaults: { duration: 1, stagger: 0, delay: 0, ease: 'none' },
  plugins: ['ScrollTrigger'],
  vanilla: 'none',
  impl: { gsap: run },
}

export default scrollBlurFocus
