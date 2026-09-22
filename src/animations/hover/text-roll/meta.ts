import type { AnimationModule } from '../../../lib/types'
import { run } from './gsap'
import { run as vanillaRun } from './vanilla'

const textRoll: AnimationModule = {
  id: 'text-roll', name: 'Text Roll', category: 'hover',
  roles: ['button', 'link', 'label'], tags: ['hover', 'mask'],
  blurb: 'Hover or focus to roll the label up and reveal a duplicate.',
  defaults: { duration: 0.35, stagger: 0, delay: 0, ease: 'power3.out' },
  plugins: [],
  vanilla: 'full',
  impl: { gsap: run, vanilla: vanillaRun },
}
export default textRoll
