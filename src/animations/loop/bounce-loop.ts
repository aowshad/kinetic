import { gsap } from '../../lib/gsap'
import type { AnimationModule } from '../../lib/types'

const run: AnimationModule['run'] = (el, o, onComplete) => {
  // #region body
  el.style.display = 'inline-block'
  const tl = gsap.fromTo(
    el,
    { y: -20 },
    { y: 0, duration: o.duration, ease: o.ease, repeat: -1, repeatDelay: o.duration * 0.4, delay: o.delay },
  )
  onComplete?.() // @internal
  return () => {
    tl.kill()
    gsap.set(el, { clearProps: 'y' })
    el.style.display = ''
  }
  // #endregion body
}
const bounceLoop: AnimationModule = {
  id: 'bounce-loop', name: 'Bounce Loop', category: 'loop',
  roles: ['heading', 'label', 'button'], tags: ['bounce'],
  blurb: 'Text bounces up and down endlessly, like a ball at rest.',
  defaults: { duration: 0.6, stagger: 0, delay: 0, ease: 'bounce.out' },
  plugins: [], run,
}

export default bounceLoop
