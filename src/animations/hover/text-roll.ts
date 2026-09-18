import { gsap } from '../../lib/gsap'
import type { AnimationModule } from '../../lib/types'

const run: AnimationModule['run'] = (el, o) => {
  const text = el.textContent ?? ''
  el.setAttribute('aria-label', text)
  el.innerHTML = ''
  Object.assign(el.style, { display: 'inline-block', overflow: 'hidden', position: 'relative', whiteSpace: 'nowrap' })
  const rows = [0, 1].map((i) => {
    const row = document.createElement('span')
    row.textContent = text
    row.setAttribute('aria-hidden', 'true')
    row.style.display = 'block'
    if (i === 1) Object.assign(row.style, { position: 'absolute', top: '0', left: '0', color: 'var(--accent)' })
    el.appendChild(row)
    return row
  })
  gsap.set(rows[1], { yPercent: 100 })
  const enter = () => gsap.to(rows, { yPercent: (i) => (i ? 0 : -100), duration: o.duration, ease: o.ease, overwrite: true })
  const leave = () => gsap.to(rows, { yPercent: (i) => (i ? 100 : 0), duration: o.duration, ease: o.ease, overwrite: true })
  el.addEventListener('pointerenter', enter)
  el.addEventListener('pointerleave', leave)
  return () => {
    el.removeEventListener('pointerenter', enter)
    el.removeEventListener('pointerleave', leave)
  }
}
const textRoll: AnimationModule = {
  id: 'text-roll',
  name: 'Text Roll',
  category: 'hover',
  roles: ['button', 'link', 'label'],
  tags: ['hover', 'mask'],
  blurb: 'Hover to roll the label up and swap in a duplicate underneath.',
  defaults: { duration: 0.35, stagger: 0, delay: 0, ease: 'power3.out' },
  plugins: [],
  run,
}
export default textRoll
