export interface SplitResult {
  chars: HTMLElement[]
  words: HTMLElement[]
  revert: () => void
}

/**
 * Splits `el`'s text into per-character and per-word spans for staggered
 * animation — the one thing GSAP's SplitText does that a zero-dependency
 * implementation has to do itself. Inlined verbatim into every emitted
 * snippet that needs it (see emit.ts); has no imports of its own so that
 * inlining is just a copy-paste.
 *
 * - Grapheme-aware: uses Intl.Segmenter when available instead of spreading
 *   the string, so combining marks, conjuncts, and family emoji stay as one
 *   character instead of shattering into broken pieces.
 * - Whitespace-preserving: multiple spaces between words survive as-is,
 *   they don't collapse to one.
 * - Elements that already contain child markup are left alone — animate the
 *   element whole rather than risk mangling existing structure.
 */
export function splitChars(el: HTMLElement): SplitResult {
  const text = el.textContent ?? ''

  if (el.children.length > 0) {
    return { chars: [el], words: [el], revert: () => {} }
  }

  const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

  const segmenter =
    typeof Intl !== 'undefined' && 'Segmenter' in Intl
      ? new Intl.Segmenter(undefined, { granularity: 'grapheme' })
      : null
  const toChars = (s: string): string[] =>
    segmenter ? Array.from(segmenter.segment(s), (seg) => seg.segment) : Array.from(s)

  const tokens = text.match(/\S+|\s+/g) ?? []
  el.setAttribute('aria-label', text)
  el.innerHTML = tokens
    .map((token) => {
      if (/^\s+$/.test(token)) return token
      const chars = toChars(token)
        .map((c) => `<span class="k-char">${escape(c)}</span>`)
        .join('')
      return `<span class="k-word" aria-hidden="true">${chars}</span>`
    })
    .join('')

  return {
    chars: [...el.querySelectorAll<HTMLElement>('.k-char')],
    words: [...el.querySelectorAll<HTMLElement>('.k-word')],
    revert: () => {
      el.textContent = text
      el.removeAttribute('aria-label')
    },
  }
}
