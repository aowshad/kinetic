import { LINEAR_EASE_MAP } from '../../../lib/linearEases'
import type { AnimationImpl } from '../../../lib/types'

export const run: AnimationImpl = (el, o, onComplete) => {
  // #region body
  const text = el.textContent ?? ''
  el.setAttribute('aria-label', text)

  // Range.getClientRects() returns one rect per rendered line — the browser
  // has already done line-breaking for us, no text-splitting library needed.
  const range = document.createRange()
  range.selectNodeContents(el)
  const lineRects = Array.from(range.getClientRects())
  const elTop = el.getBoundingClientRect().top

  el.textContent = ''
  const lines = lineRects.map((r) => {
    const mask = document.createElement('span')
    mask.className = 'k-line-mask'
    mask.style.height = `${r.height}px`
    const line = document.createElement('span')
    line.className = 'k-line'
    line.textContent = text
    // Each clone holds the FULL text at the SAME width, so it wraps
    // identically; shifting it up by this line's own offset and cropping to
    // one line's height reveals just that line's slice.
    line.style.marginTop = `${elTop - r.top}px`
    mask.append(line)
    el.append(mask)
    return line
  })

  const easing = LINEAR_EASE_MAP[o.ease] ?? 'linear'
  const anims = lines.map((line, i) =>
    line.animate([{ transform: 'translateY(100%)' }, { transform: 'none' }], {
      duration: o.duration * 1000,
      delay: (o.delay + i * o.stagger) * 1000,
      easing,
      fill: 'backwards',
    }),
  )
  Promise.all(anims.map((a) => a.finished)).then(() => onComplete?.()).catch(() => {}) // @internal
  return () => {
    anims.forEach((a) => a.cancel())
    el.textContent = text
    el.removeAttribute('aria-label')
  }
  // #endregion body
}
