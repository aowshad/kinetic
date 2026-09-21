import { gsap } from '../../lib/gsap'
import type { AnimationModule } from '../../lib/types'

const run: AnimationModule['run'] = (el, o, onComplete) => {
  // #region body
  const text = el.textContent ?? ''
  el.setAttribute('aria-label', text)
  el.style.position = 'relative'
  el.style.whiteSpace = 'nowrap' // bold is wider than the base weight — keep both on one line
  const bold = document.createElement('span')
  bold.textContent = text
  bold.className = 'k-weight-bold'
  bold.setAttribute('aria-hidden', 'true')
  el.append(bold)
  const tl = gsap.timeline({ delay: o.delay, repeat: -1, yoyo: true })
  tl.fromTo(bold, { opacity: 0 }, { opacity: 1, duration: o.duration, ease: o.ease })
  onComplete?.() // @internal
  return () => {
    tl.kill()
    bold.remove()
    el.style.whiteSpace = ''
  }
  // #endregion body
}
const weightMorph: AnimationModule = {
  id: 'weight-morph', name: 'Weight Morph', category: 'kinetic',
  roles: ['heading', 'label'], tags: ['loop', 'weight'],
  blurb: 'Text breathes between light and bold weight, endlessly.',
  defaults: { duration: 0.9, stagger: 0, delay: 0, ease: 'sine.inOut' },
  plugins: [], run,
}

export default weightMorph
