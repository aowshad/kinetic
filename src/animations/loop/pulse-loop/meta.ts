import type { AnimationModule } from '../../../lib/types'
import { run } from './gsap'
import { run as vanillaRun } from './vanilla'

const pulseLoop: AnimationModule = {
  id: 'pulse-loop', name: 'Pulse Loop', category: 'loop',
  roles: ['heading', 'label', 'button'], tags: ['pulse'],
  blurb: 'Text breathes with a soft, uniform pulse, forever.',
  defaults: { duration: 0.8, stagger: 0, delay: 0, ease: 'sine.inOut' },
  plugins: [],
  vanilla: 'full',
  impl: { gsap: run, vanilla: vanillaRun },
}

export default pulseLoop
