import type { AnimationModule } from '../../../lib/types'
import { run } from './gsap'
import { run as vanillaRun } from './vanilla'

const loadingUnderline: AnimationModule = {
  id: 'loading-underline', name: 'Loading Underline', category: 'loop',
  roles: ['button', 'link', 'label'], tags: ['line'],
  blurb: 'An accent bar sweeps back and forth beneath the text forever.',
  defaults: { duration: 1.2, stagger: 0, delay: 0, ease: 'sine.inOut' },
  plugins: [],
  reducedMotion: 'skip', // repeats forever — a near-zero duration would strobe rather than stop
  vanilla: 'full',
  impl: { gsap: run, vanilla: vanillaRun },
}

export default loadingUnderline
