import { gsap } from '../../lib/gsap'
import type { AnimationModule } from '../../lib/types'

const run: AnimationModule['run'] = (el, o, onComplete) => {
  // #region body
  const text = el.textContent ?? ''
  return gsap.timeline({ delay: o.delay }).to(el, {
    duration: o.duration,
    scrambleText: { text, chars: 'upperCase', revealDelay: 0.3, speed: 0.4 },
    ease: o.ease,
    onComplete, // @internal
  })
  // #endregion body
}

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
  run,
}

export default scramble
