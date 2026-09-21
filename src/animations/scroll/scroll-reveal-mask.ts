import { gsap } from '../../lib/gsap'
import type { AnimationModule } from '../../lib/types'

const run: AnimationModule['run'] = (el, o, onComplete) => {
  // #region body
  gsap.set(el, { clipPath: 'inset(0 100% 0 0)' })
  const tl = gsap.timeline({
    scrollTrigger: { trigger: el, start: 'top 85%', end: 'top 35%', scrub: true },
  })
  tl.to(el, { clipPath: 'inset(0 0% 0 0)', duration: o.duration, ease: o.ease })
  onComplete?.() // @internal
  return () => {
    tl.scrollTrigger?.kill()
    tl.kill()
    gsap.set(el, { clearProps: 'clipPath' })
  }
  // #endregion body
}
const scrollRevealMask: AnimationModule = {
  id: 'scroll-reveal-mask', name: 'Scroll Reveal Mask', category: 'scroll',
  roles: ['heading', 'paragraph', 'label'], tags: ['scrub', 'mask'],
  blurb: 'A mask wipes open across the text as you scroll it into view.',
  defaults: { duration: 1, stagger: 0, delay: 0, ease: 'none' },
  plugins: ['ScrollTrigger'], run,
}

export default scrollRevealMask
