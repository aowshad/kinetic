import { gsap } from '../../../lib/gsap'
import type { AnimationImpl } from '../../../lib/types'

export const run: AnimationImpl = (el, o, onComplete) => {
  // #region body
  const text = el.textContent ?? ''
  el.setAttribute('aria-label', text)
  el.style.position = 'relative'
  const clones = [0, 1].map((i) => {
    const clone = document.createElement('span')
    clone.textContent = text
    clone.className = i ? 'k-glitch-cyan' : 'k-glitch-red'
    clone.setAttribute('aria-hidden', 'true')
    el.append(clone)
    return clone
  })

  const tl = gsap.timeline({ delay: o.delay })
  tl.to(clones[0], { x: -6, clipPath: 'inset(10% 0 40% 0)', duration: o.duration / 6, repeat: 5, yoyo: true, ease: o.ease })
  tl.to(clones[1], { x: 6, clipPath: 'inset(40% 0 10% 0)', duration: o.duration / 6, repeat: 5, yoyo: true, ease: o.ease }, 0)
  tl.to(clones, { x: 0, clipPath: 'inset(0 0 0 0)', duration: 0.05, onComplete }) // @internal

  return () => {
    tl.progress(1).kill() // @emit: tl.kill()
    clones.forEach((c) => c.remove())
  }
  // #endregion body
}
