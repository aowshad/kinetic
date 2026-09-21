import { gsap } from '../../lib/gsap'
import type { AnimationModule } from '../../lib/types'

const run: AnimationModule['run'] = (el, o, onComplete) => {
  // #region body
  el.style.position = 'relative'
  el.style.display = 'inline-block'
  const bar = document.createElement('span')
  bar.className = 'k-loop-underline'
  bar.setAttribute('aria-hidden', 'true')
  el.append(bar)
  const tl = gsap.timeline({ delay: o.delay, repeat: -1, yoyo: true })
  tl.fromTo(bar, { xPercent: -100 }, { xPercent: 100, duration: o.duration, ease: o.ease })
  onComplete?.() // @internal
  return () => {
    tl.kill()
    bar.remove()
    el.style.position = ''
    el.style.display = ''
  }
  // #endregion body
}
const loadingUnderline: AnimationModule = {
  id: 'loading-underline', name: 'Loading Underline', category: 'loop',
  roles: ['button', 'link', 'label'], tags: ['line'],
  blurb: 'An accent bar sweeps back and forth beneath the text forever.',
  defaults: { duration: 1.2, stagger: 0, delay: 0, ease: 'sine.inOut' },
  plugins: [], run,
}

export default loadingUnderline
