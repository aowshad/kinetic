import type { AnimationModule } from '../../../lib/types'
import { run } from './gsap'
import { run as vanillaRun } from './vanilla'

const scrollParallaxWords: AnimationModule = {
  id: 'scroll-parallax-words', name: 'Scroll Parallax Words', category: 'scroll',
  roles: ['heading'], tags: ['scrub', 'split', 'parallax'],
  blurb: 'Each word drifts upward at its own speed as the page scrolls.',
  defaults: { duration: 1, stagger: 0, delay: 0, ease: 'none' },
  plugins: ['SplitText', 'ScrollTrigger'],
  vanilla: 'partial',
  vanillaNote: 'No scrub smoothing on browsers without scroll-driven animation support (Safari before 26) — falls back to coarser IntersectionObserver-driven updates.',
  impl: { gsap: run, vanilla: vanillaRun },
}

export default scrollParallaxWords
