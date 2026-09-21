import type { AnimationModule } from '../../../lib/types'
import { run } from './gsap'

const scramble: AnimationModule = {
  id: 'scramble',
  name: 'Scramble',
  category: 'kinetic',
  roles: ['heading', 'label', 'button'],
  tags: ['scramble', 'plugin'],
  blurb: 'Characters scramble through random glyphs before locking into the final text.',
  defaults: { duration: 1.2, stagger: 0, delay: 0, ease: 'none' },
  plugins: ['ScrambleTextPlugin'],
  fitSafety: 0.78,
  vanilla: 'none',
  impl: { gsap: run },
}

export default scramble
