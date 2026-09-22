import type { AnimationModule } from '../../../lib/types'
import { run } from './gsap'
import { run as vanillaRun } from './vanilla'

const scrollFadeStagger: AnimationModule = {
  id: 'scroll-fade-stagger', name: 'Scroll Fade Stagger', category: 'scroll',
  roles: ['heading', 'paragraph'], tags: ['scrub', 'split'],
  blurb: 'Characters rise and fade in one after another as you scroll.',
  defaults: { duration: 0.6, stagger: 0.03, delay: 0, ease: 'power2.out' },
  plugins: ['SplitText', 'ScrollTrigger'],
  vanilla: 'partial',
  vanillaNote: 'No scrub smoothing on browsers without scroll-driven animation support (Safari before 26) — falls back to coarser IntersectionObserver-driven updates.',
  impl: { gsap: run, vanilla: vanillaRun },
}

export default scrollFadeStagger
