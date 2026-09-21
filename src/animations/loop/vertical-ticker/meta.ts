import type { AnimationModule } from '../../../lib/types'
import { run } from './gsap'

const verticalTicker: AnimationModule = {
  id: 'vertical-ticker', name: 'Vertical Ticker', category: 'loop',
  roles: ['heading', 'label', 'paragraph'], tags: ['ticker'],
  blurb: 'Text scrolls upward in an endless vertical loop, like a credits reel.',
  defaults: { duration: 3, stagger: 0, delay: 0, ease: 'none' },
  plugins: [],
  vanilla: 'none',
  impl: { gsap: run },
}

export default verticalTicker
