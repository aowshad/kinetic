import { gsap } from '../../lib/gsap'
import type { AnimationModule } from '../../lib/types'

const run: AnimationModule['run'] = (el, o, onComplete) => {
  // #region body
  gsap.set(el, { scale: 0.6, transformOrigin: '50% 50%' })
  const tl = gsap.timeline({
    scrollTrigger: { trigger: el, start: 'top 85%', end: 'top 30%', scrub: true },
  })
  tl.to(el, { scale: 1, duration: o.duration, ease: o.ease })
  onComplete?.() // @internal
  return () => {
    tl.scrollTrigger?.kill()
    tl.kill()
    gsap.set(el, { clearProps: 'scale,transformOrigin' })
  }
  // #endregion body
}
const scrollScaleIn: AnimationModule = {
  id: 'scroll-scale-in', name: 'Scroll Scale In', category: 'scroll',
  roles: ['heading', 'button', 'label'], tags: ['scrub', 'scale'],
  blurb: 'Text scales up to full size as it scrolls to the center of the screen.',
  defaults: { duration: 1, stagger: 0, delay: 0, ease: 'none' },
  plugins: ['ScrollTrigger'], run,
}

export default scrollScaleIn
