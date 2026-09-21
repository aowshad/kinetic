import { gsap } from '../../lib/gsap'
import type { AnimationModule } from '../../lib/types'

const run: AnimationModule['run'] = (el, o, onComplete) => {
  // #region body
  const text = el.textContent ?? ''
  el.setAttribute('aria-label', text)
  el.textContent = ''
  el.style.overflow = 'hidden'
  const track = document.createElement('span')
  track.className = 'k-marquee-track'
  ;[0, 1].forEach(() => {
    const seg = document.createElement('span')
    seg.textContent = text
    seg.className = 'k-marquee-seg'
    seg.setAttribute('aria-hidden', 'true')
    track.append(seg)
  })
  el.append(track)
  const tl = gsap.timeline({ repeat: -1 })
  tl.fromTo(track, { xPercent: 0 }, { xPercent: -50, duration: o.duration, ease: o.ease })
  onComplete?.() // @internal
  return () => {
    tl.kill()
    el.textContent = text
    el.style.overflow = ''
  }
  // #endregion body
}
const marquee: AnimationModule = {
  id: 'marquee', name: 'Marquee', category: 'loop',
  roles: ['heading', 'label', 'paragraph'], tags: ['ticker'],
  blurb: 'Text scrolls sideways in an endless, seamless ticker.',
  defaults: { duration: 3, stagger: 0, delay: 0, ease: 'none' },
  plugins: [], run,
}

export default marquee
