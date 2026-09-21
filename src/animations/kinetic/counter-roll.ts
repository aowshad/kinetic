import { gsap } from '../../lib/gsap'
import type { AnimationModule } from '../../lib/types'

const run: AnimationModule['run'] = (el, o, onComplete) => {
  // #region body
  const raw = el.textContent ?? ''
  const match = raw.match(/[\d,]*\d/)
  if (!match) {
    onComplete?.() // @internal
    return () => {}
  }
  const idx = match.index ?? 0
  const prefix = raw.slice(0, idx)
  const suffix = raw.slice(idx + match[0].length)
  const target = Number(match[0].replace(/,/g, ''))
  const counter = { value: 0 }
  const tl = gsap.timeline({ delay: o.delay })
  tl.to(counter, {
    value: target,
    duration: o.duration,
    ease: o.ease,
    onUpdate: () => {
      el.textContent = prefix + Math.round(counter.value).toLocaleString() + suffix
    },
    onComplete, // @internal
  })
  return () => {
    tl.progress(1).kill() // @emit: tl.kill()
    el.textContent = raw
  }
  // #endregion body
}
const counterRoll: AnimationModule = {
  id: 'counter-roll', name: 'Counter Roll', category: 'kinetic',
  roles: ['counter'], tags: ['number'],
  blurb: 'Digits count up from zero to the target number. Type a number as the sample text to try it.',
  defaults: { duration: 1.2, stagger: 0, delay: 0, ease: 'power2.out' },
  plugins: [], run,
}

export default counterRoll
