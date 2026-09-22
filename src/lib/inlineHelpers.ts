/**
 * Plain-JS versions of the zero-dependency helpers vanilla.ts
 * implementations depend on, for inlining directly above an emitted
 * function — a copied snippet that imports these from the repo is the
 * exact failure mode this whole approach exists to avoid.
 *
 * Kept in sync BY HAND with splitChars.ts / easeAt.ts / scrollScrub.ts:
 * identical logic, TypeScript-only syntax (parameter/return types, the
 * exported SplitResult interface) removed, since the emitted snippet is
 * plain JS with no build step. If those files' logic changes, update these
 * strings to match.
 */

export const SPLIT_CHARS_SOURCE = `function splitChars(el) {
  const text = el.textContent ?? ''

  if (el.children.length > 0) {
    return { chars: [el], words: [el], revert: () => {} }
  }

  const escape = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

  const segmenter =
    typeof Intl !== 'undefined' && 'Segmenter' in Intl
      ? new Intl.Segmenter(undefined, { granularity: 'grapheme' })
      : null
  const toChars = (s) => (segmenter ? Array.from(segmenter.segment(s), (seg) => seg.segment) : Array.from(s))

  const tokens = text.match(/\\S+|\\s+/g) ?? []
  el.setAttribute('aria-label', text)
  el.innerHTML = tokens
    .map((token) => {
      if (/^\\s+$/.test(token)) return token
      const chars = toChars(token)
        .map((c) => \`<span class="k-char">\${escape(c)}</span>\`)
        .join('')
      return \`<span class="k-word" aria-hidden="true">\${chars}</span>\`
    })
    .join('')

  return {
    chars: [...el.querySelectorAll('.k-char')],
    words: [...el.querySelectorAll('.k-word')],
    revert: () => {
      el.textContent = text
      el.removeAttribute('aria-label')
    },
  }
}`

export const EASE_AT_SOURCE = `function easeAt(points, t) {
  const clamped = t < 0 ? 0 : t > 1 ? 1 : t
  const scaled = clamped * (points.length - 1)
  const i = Math.floor(scaled)
  const frac = scaled - i
  const a = points[i]
  const b = points[Math.min(i + 1, points.length - 1)]
  return a + (b - a) * frac
}`

export const SCROLL_SCRUB_SOURCE = `function scrollScrub(target, keyframes, options, subject, startVh, endVh, windowStart = 0, windowEnd = 100) {
  const vh = window.innerHeight || document.documentElement.clientHeight
  const h = subject.getBoundingClientRect().height || 1
  const coverAt = (vhFraction) => Math.min(100, Math.max(0, (((1 - vhFraction) * vh) / (vh + h)) * 100))
  const coverStart = coverAt(startVh)
  const coverEnd = coverAt(endVh)
  const span = coverEnd - coverStart
  const rangeStartPercent = coverStart + (windowStart / 100) * span
  const rangeEndPercent = coverStart + (windowEnd / 100) * span

  const ViewTimelineCtor = window.ViewTimeline

  if (ViewTimelineCtor) {
    const timeline = new ViewTimelineCtor({ subject, axis: 'block' })
    const anim = target.animate(keyframes, {
      fill: 'both',
      ...options,
      timeline,
      rangeStart: \`cover \${rangeStartPercent}%\`,
      rangeEnd: \`cover \${rangeEndPercent}%\`,
    })
    return () => anim.cancel()
  }

  const anim = target.animate(keyframes, { ...options, duration: 1000, fill: 'both' })
  anim.pause()
  const update = (rect) => {
    const rawPercent = ((vh - rect.top) / (vh + rect.height)) * 100
    const windowed = (rawPercent - rangeStartPercent) / (rangeEndPercent - rangeStartPercent)
    anim.currentTime = Math.min(1, Math.max(0, windowed)) * 1000
  }
  const observer = new IntersectionObserver(([entry]) => update(entry.boundingClientRect), {
    threshold: Array.from({ length: 41 }, (_, i) => i / 40),
  })
  observer.observe(subject)
  return () => {
    observer.disconnect()
    anim.cancel()
  }
}`
