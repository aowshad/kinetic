import type { AnimationModule } from '../../../lib/types'
import { run } from './gsap'

const decodeMatrix: AnimationModule = {
  id: 'decode-matrix', name: 'Decode Matrix', category: 'kinetic',
  roles: ['heading', 'label', 'button'], tags: ['scramble', 'mono'],
  blurb: 'Each character decodes from scrambled noise, one after another.',
  defaults: { duration: 0.4, stagger: 0.05, delay: 0, ease: 'none' },
  plugins: ['ScrambleTextPlugin'],
  vanilla: 'none',
  impl: { gsap: run },
}

export default decodeMatrix
