import type { AnimationModule } from '../../../lib/types'
import { run } from './gsap'

const scrollParallaxWords: AnimationModule = {
  id: 'scroll-parallax-words', name: 'Scroll Parallax Words', category: 'scroll',
  roles: ['heading'], tags: ['scrub', 'split', 'parallax'],
  blurb: 'Each word drifts upward at its own speed as the page scrolls.',
  defaults: { duration: 1, stagger: 0, delay: 0, ease: 'none' },
  plugins: ['SplitText', 'ScrollTrigger'],
  vanilla: 'none',
  impl: { gsap: run },
}

export default scrollParallaxWords
