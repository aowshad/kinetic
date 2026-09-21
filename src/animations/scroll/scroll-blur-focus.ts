import { gsap } from '../../lib/gsap'
import type { AnimationModule } from '../../lib/types'

const run: AnimationModule['run'] = (el, o, onComplete) => {
  // #region body
  gsap.set(el, { filter: 'blur(10px)', opacity: 0.4 })
  const tl = gsap.timeline({
    scrollTrigger: { trigger: el, start: 'top 85%', end: 'top 35%', scrub: true },
  })
  tl.to(el, { filter: 'blur(0px)', opacity: 1, duration: o.duration, ease: o.ease })
  onComplete?.() // @internal
  return () => {
    tl.scrollTrigger?.kill()
    tl.kill()
    gsap.set(el, { clearProps: 'filter,opacity' })
  }
  // #endregion body
}
const scrollBlurFocus: AnimationModule = {
  id: 'scroll-blur-focus', name: 'Scroll Blur Focus', category: 'scroll',
  roles: ['heading', 'paragraph'], tags: ['scrub', 'blur'],
  blurb: 'Text sharpens into focus as it scrolls toward the center of the screen.',
  defaults: { duration: 1, stagger: 0, delay: 0, ease: 'none' },
  plugins: ['ScrollTrigger'], run,
}

export default scrollBlurFocus
