import type { AnimationModule } from '../../../lib/types'
import { run } from './gsap'
import { run as vanillaRun } from './vanilla'

const scrollRevealMask: AnimationModule = {
  id: 'scroll-reveal-mask', name: 'Scroll Reveal Mask', category: 'scroll',
  roles: ['heading', 'paragraph', 'label'], tags: ['scrub', 'mask'],
  blurb: 'A mask wipes open across the text as you scroll it into view.',
  defaults: { duration: 1, stagger: 0, delay: 0, ease: 'none' },
  plugins: ['ScrollTrigger'],
  reducedMotion: 'skip', // scroll-position-driven, not duration-driven — nothing to settle toward
  vanilla: 'partial',
  vanillaNote: 'No scrub smoothing in Safari before 26 — falls back to IntersectionObserver.',
  impl: { gsap: run, vanilla: vanillaRun },
}

export default scrollRevealMask
