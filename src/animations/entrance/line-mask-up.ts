import { gsap, SplitText } from '../../lib/gsap'
import type { AnimationModule } from '../../lib/types'

const run: AnimationModule['run'] = (el, o, onComplete) => {
  // #region body
  el.setAttribute('aria-label', el.textContent ?? '')
  const split = new SplitText(el, { type: 'lines', linesClass: 'k-line' })
  split.lines.forEach((line) => {
    const mask = document.createElement('span')
    mask.className = 'k-line-mask'
    line.before(mask)
    mask.append(line)
    line.setAttribute('aria-hidden', 'true')
  })
  const tl = gsap.timeline({ delay: o.delay })
  tl.from(split.lines, {
    yPercent: 100,
    duration: o.duration,
    stagger: o.stagger,
    ease: o.ease,
    onComplete, // @internal
  })
  return () => {
    tl.progress(1).kill() // @emit: tl.kill()
    split.revert()
  }
  // #endregion body
}
const lineMaskUp: AnimationModule = {
  id: 'line-mask-up', name: 'Line Mask Up', category: 'entrance',
  roles: ['paragraph', 'heading'], tags: ['split', 'lines', 'mask'],
  blurb: 'Each line slides up from behind a clipped mask.',
  defaults: { duration: 0.7, stagger: 0.12, delay: 0, ease: 'power4.out' },
  plugins: ['SplitText'], run,
}

export default lineMaskUp
