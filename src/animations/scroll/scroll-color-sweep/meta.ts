import type { AnimationModule } from '../../../lib/types'
import { run } from './gsap'
import { run as vanillaRun } from './vanilla'

const scrollColorSweep: AnimationModule = {
  id: 'scroll-color-sweep', name: 'Scroll Color Sweep', category: 'scroll',
  roles: ['heading', 'paragraph', 'label'], tags: ['scrub', 'split', 'color'],
  blurb: 'Words pick up an accent color one by one as you scroll past them.',
  defaults: { duration: 0.5, stagger: 0.1, delay: 0, ease: 'none' },
  plugins: ['SplitText', 'ScrollTrigger'],
  reducedMotion: 'skip', // scroll-position-driven, not duration-driven — nothing to settle toward
  vanilla: 'partial',
  vanillaNote: 'No scrub smoothing in Safari before 26 — falls back to IntersectionObserver.',
  impl: { gsap: run, vanilla: vanillaRun },
}

export default scrollColorSweep
