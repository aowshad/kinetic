import { gsap } from '../../lib/gsap'
import type { AnimationModule } from '../../lib/types'

const run: AnimationModule['run'] = (el, o, onComplete) => {
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
const typewriter: AnimationModule = {
  id: 'typewriter', name: 'Typewriter', category: 'kinetic',
  roles: ['heading', 'label', 'paragraph'], tags: ['text', 'plugin'],
  blurb: 'Text types itself out with a blinking caret.',
  defaults: { duration: 1.5, stagger: 0, delay: 0, ease: 'none' },
  plugins: ['TextPlugin'], run,
}

export default typewriter
