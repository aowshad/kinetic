import { gsap } from '../../../lib/gsap'
import type { AnimationImpl } from '../../../lib/types'

export const run: AnimationImpl = (el, o, onComplete) => {
  // #region body
  const text = el.textContent ?? ''
  el.textContent = ''
  el.classList.add('k-type-caret')
  const tl = gsap.timeline({ delay: o.delay })
  tl.to(el, {
    duration: o.duration,
    text,
    ease: o.ease,
    onComplete, // @internal
  })
  return () => {
    tl.progress(1).kill() // @emit: tl.kill()
    el.classList.remove('k-type-caret')
    el.textContent = text
  }
  // #endregion body
}
