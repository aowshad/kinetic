import type { AnimationModule } from '../../../lib/types'
import { run } from './gsap'
import { run as vanillaRun } from './vanilla'

const randomOrderFade: AnimationModule = {
  id: 'random-order-fade', name: 'Random Order Fade', category: 'entrance',
  roles: ['heading', 'paragraph', 'label'], tags: ['split', 'random'],
  blurb: 'Characters fade in one by one in a random order.',
  defaults: { duration: 0.4, stagger: 0.03, delay: 0, ease: 'power1.out' },
  plugins: ['SplitText'],
  reducedMotion: 'settle',
  vanilla: 'full',
  impl: { gsap: run, vanilla: vanillaRun },
}

export default randomOrderFade
