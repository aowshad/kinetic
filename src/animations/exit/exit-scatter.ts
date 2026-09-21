import { gsap, SplitText } from '../../lib/gsap'
import type { AnimationModule } from '../../lib/types'

const run: AnimationModule['run'] = (el, o, onComplete) => {
  // #region body
  el.setAttribute('aria-label', el.textContent ?? '')
  const split = new SplitText(el, { type: 'chars', charsClass: 'k-char' })
  const tl = gsap.timeline({ delay: o.delay })
  split.chars.forEach((c, i) => {
    const angle = (i / split.chars.length) * Math.PI * 2
    tl.to(
      c,
      {
        x: Math.cos(angle) * 60,
        y: Math.sin(angle) * 60,
        rotation: (i % 2 ? 1 : -1) * 45,
        opacity: 0,
        duration: o.duration,
        ease: o.ease,
      },
      i * o.stagger,
    )
  })
  tl.call(() => onComplete?.()) // @internal
  return () => {
    tl.kill()
    split.revert()
  }
  // #endregion body
}
const exitScatter: AnimationModule = {
  id: 'exit-scatter', name: 'Exit Scatter', category: 'exit',
  roles: ['heading', 'label'], tags: ['split', 'scatter'],
  blurb: 'Characters scatter outward in every direction and vanish.',
  defaults: { duration: 0.5, stagger: 0.03, delay: 0, ease: 'power2.in' },
  plugins: ['SplitText'], run,
}

export default exitScatter
