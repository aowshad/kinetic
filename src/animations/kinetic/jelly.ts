import { gsap } from '../../lib/gsap'
import type { AnimationModule } from '../../lib/types'

const run: AnimationModule['run'] = (el, o, onComplete) => {
  // #region body
  el.style.display = 'inline-block'
  el.style.transformOrigin = '50% 100%'
  const tl = gsap.timeline({ delay: o.delay, repeat: -1, yoyo: true })
  tl.to(el, { scaleX: 1.15, scaleY: 0.85, duration: o.duration, ease: o.ease })
  onComplete?.() // @internal
  return () => {
    tl.kill()
    gsap.set(el, { clearProps: 'scale' })
    el.style.display = ''
    el.style.transformOrigin = ''
  }
  // #endregion body
}
const jelly: AnimationModule = {
  id: 'jelly', name: 'Jelly', category: 'kinetic',
  roles: ['heading', 'label', 'button'], tags: ['loop', 'elastic'],
  blurb: 'The whole word squashes and stretches like jelly, endlessly.',
  defaults: { duration: 0.5, stagger: 0, delay: 0, ease: 'elastic.out(1, 0.3)' },
  plugins: [], run,
}

export default jelly
