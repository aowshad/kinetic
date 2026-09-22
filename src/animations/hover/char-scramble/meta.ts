import type { AnimationModule } from '../../../lib/types'
import { run } from './gsap'
import { run as vanillaRun } from './vanilla'

const charScramble: AnimationModule = {
  id: 'char-scramble', name: 'Char Scramble', category: 'hover',
  roles: ['button', 'link', 'label'], tags: ['hover', 'scramble'],
  blurb: 'Hover or focus to scramble the text before it decodes back.',
  defaults: { duration: 0.5, stagger: 0, delay: 0, ease: 'none' },
  plugins: ['ScrambleTextPlugin'],
  vanilla: 'full',
  impl: { gsap: run, vanilla: vanillaRun },
}
export default charScramble
