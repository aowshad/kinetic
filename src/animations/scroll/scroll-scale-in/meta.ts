import type { AnimationModule } from '../../../lib/types'
import { run } from './gsap'
import { run as vanillaRun } from './vanilla'

const scrollScaleIn: AnimationModule = {
  id: 'scroll-scale-in', name: 'Scroll Scale In', category: 'scroll',
  roles: ['heading', 'button', 'label'], tags: ['scrub', 'scale'],
  blurb: 'Text scales up to full size as it scrolls to the center of the screen.',
  defaults: { duration: 1, stagger: 0, delay: 0, ease: 'none' },
  plugins: ['ScrollTrigger'],
  vanilla: 'partial',
  vanillaNote: 'No scrub smoothing on browsers without scroll-driven animation support (Safari before 26) — falls back to coarser IntersectionObserver-driven updates.',
  impl: { gsap: run, vanilla: vanillaRun },
}

export default scrollScaleIn
