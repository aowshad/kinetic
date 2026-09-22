import type { AnimationModule } from '../../../lib/types'
import { run } from './gsap'
import { run as vanillaRun } from './vanilla'

const underlineWipe: AnimationModule = {
  id: 'underline-wipe', name: 'Underline Wipe', category: 'hover',
  roles: ['link', 'button', 'label'], tags: ['hover', 'line'],
  blurb: 'Hover or focus to wipe an accent underline in from the left.',
  defaults: { duration: 0.3, stagger: 0, delay: 0, ease: 'power3.out' },
  plugins: [],
  reducedMotion: 'settle',
  vanilla: 'full',
  impl: { gsap: run, vanilla: vanillaRun },
}
export default underlineWipe
