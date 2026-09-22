import type { AnimationModule } from '../../../lib/types'
import { run } from './gsap'
import { run as vanillaRun } from './vanilla'

const inkFill: AnimationModule = {
  id: 'ink-fill', name: 'Ink Fill', category: 'hover',
  roles: ['heading', 'label', 'button'], tags: ['hover', 'fill'],
  blurb: 'Hover or focus to fill the text with accent color from left to right.',
  defaults: { duration: 0.4, stagger: 0, delay: 0, ease: 'power3.out' },
  plugins: [],
  vanilla: 'full',
  impl: { gsap: run, vanilla: vanillaRun },
}
export default inkFill
