import { gsap } from '../../lib/gsap'
import type { AnimationModule } from '../../lib/types'

const run: AnimationModule['run'] = (el, o, onComplete) => {
  // #region body
  el.classList.add('k-shimmer')
  const tl = gsap.timeline({ delay: o.delay, repeat: -1 })
  tl.fromTo(el, { backgroundPosition: '150% 0' }, { backgroundPosition: '-50% 0', duration: o.duration, ease: o.ease })
  onComplete?.() // @internal
  return () => {
    tl.kill()
    el.classList.remove('k-shimmer')
    gsap.set(el, { clearProps: 'backgroundPosition' })
  }
  // #endregion body
}
const shimmerSweep: AnimationModule = {
  id: 'shimmer-sweep', name: 'Shimmer Sweep', category: 'kinetic',
  roles: ['heading', 'label', 'button'], tags: ['loop', 'shine'],
  blurb: 'A soft band of light sweeps across the text on an endless loop.',
  defaults: { duration: 2, stagger: 0, delay: 0, ease: 'none' },
  plugins: [], run,
}

export default shimmerSweep
