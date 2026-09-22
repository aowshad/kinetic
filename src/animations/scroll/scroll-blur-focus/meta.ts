import type { AnimationModule } from '../../../lib/types'
import { run } from './gsap'
import { run as vanillaRun } from './vanilla'

const scrollBlurFocus: AnimationModule = {
  id: 'scroll-blur-focus', name: 'Scroll Blur Focus', category: 'scroll',
  roles: ['heading', 'paragraph'], tags: ['scrub', 'blur'],
  blurb: 'Text sharpens into focus as it scrolls toward the center of the screen.',
  defaults: { duration: 1, stagger: 0, delay: 0, ease: 'none' },
  plugins: ['ScrollTrigger'],
  reducedMotion: 'skip', // scroll-position-driven, not duration-driven — nothing to settle toward
  vanilla: 'partial',
  vanillaNote: 'No scrub smoothing in Safari before 26 — falls back to IntersectionObserver.',
  impl: { gsap: run, vanilla: vanillaRun },
}

export default scrollBlurFocus
