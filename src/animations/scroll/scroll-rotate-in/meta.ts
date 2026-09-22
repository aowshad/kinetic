import type { AnimationModule } from '../../../lib/types'
import { run } from './gsap'
import { run as vanillaRun } from './vanilla'

const scrollRotateIn: AnimationModule = {
  id: 'scroll-rotate-in', name: 'Scroll Rotate In', category: 'scroll',
  roles: ['heading', 'label'], tags: ['scrub', 'split', 'rotate'],
  blurb: 'Characters tumble upright one after another as you scroll.',
  defaults: { duration: 0.5, stagger: 0.04, delay: 0, ease: 'power2.out' },
  plugins: ['SplitText', 'ScrollTrigger'],
  vanilla: 'partial',
  vanillaNote: 'No scrub smoothing on browsers without scroll-driven animation support (Safari before 26) — falls back to coarser IntersectionObserver-driven updates.',
  impl: { gsap: run, vanilla: vanillaRun },
}

export default scrollRotateIn
