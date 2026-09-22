import type { AnimationModule, AnimationOptions, TextRole } from './types'
import { LINEAR_EASE_MAP, EASE_POINTS } from './linearEases'
import { SPLIT_CHARS_SOURCE, EASE_AT_SOURCE, SCROLL_SCRUB_SOURCE } from './inlineHelpers'

const ROLE_TAG: Record<TextRole, string> = {
  heading: 'h2',
  paragraph: 'p',
  button: 'button',
  link: 'a',
  label: 'span',
  counter: 'span',
}

function toCamel(id: string) {
  return id.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase())
}

function extractBody(source: string): string {
  const m = source.match(/\/\/ #region body\n([\s\S]*?)\n\s*\/\/ #endregion body/)
  return m ? m[1] : source
}

function dedent(body: string): string {
  return body
    .split('\n')
    .map((l) => (l.startsWith('  ') ? l.slice(2) : l))
    .join('\n')
}

function indent(body: string, spaces: number): string {
  const pad = ' '.repeat(spaces)
  return body
    .split('\n')
    .map((l) => (l ? pad + l : l))
    .join('\n')
}

// 'skip' — never runs under reduced motion (loop-tagged animations repeat
// forever, so a near-zero duration would strobe rather than stop; scroll
// animations aren't duration-driven at all, and at least 3 of the 7 apply a
// degraded starting style — blur/clip/scale — synchronously before scroll
// position ever takes over, so "running" them leaves that degraded style
// stuck on screen until the user scrolls).
// 'scramble' — runs, but needs a 0.35s floor: GSAP's ScrambleTextPlugin
// revealDelay is an absolute number of seconds (worst case 0.3s in this
// catalog), not a fraction of the tween's own duration, so anything shorter
// leaves the GSAP path permanently scrambled.
// 'normal' — runs at a near-instant 0.01s.
type ReducedMotionGroup = 'skip' | 'scramble' | 'normal'

function reducedMotionGroup(module: AnimationModule): ReducedMotionGroup {
  if (module.category === 'loop' || module.category === 'scroll' || module.tags.includes('loop')) return 'skip'
  if (module.tags.includes('scramble')) return 'scramble'
  return 'normal'
}

function transformBody(rawBody: string, o: AnimationOptions, reducedMotionVars: boolean): string {
  return dedent(rawBody)
    .split('\n')
    .filter((line) => !/\/\/\s*@internal\s*$/.test(line))
    .map((line) => {
      const emit = line.match(/^(\s*).*?\s*\/\/\s*@emit:\s*(.+)$/)
      return emit ? `${emit[1]}${emit[2]}` : line
    })
    .join('\n')
    .replace(/\bo\.duration\b/g, reducedMotionVars ? '_duration' : String(o.duration))
    .replace(/\bo\.stagger\b/g, reducedMotionVars ? '_stagger' : String(o.stagger))
    .replace(/\bo\.delay\b/g, reducedMotionVars ? '_delay' : String(o.delay))
    .replace(/\bo\.ease\b/g, `'${o.ease}'`)
    .replace(/\s+as const\b/g, '')
    .trim()
}

// Builds the const declarations for whichever of _duration/_stagger/_delay
// the (already-substituted) body actually references — each falls back to
// the reduced-motion value only when the visitor's OS prefers it, otherwise
// it's the exact literal the non-reduced-motion path already used.
function reducedMotionPreamble(group: 'scramble' | 'normal', o: AnimationOptions, body: string, pad: string): string {
  const reduced = group === 'scramble' ? 0.35 : 0.01
  const lines = [`${pad}const _reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches`]
  if (body.includes('_duration')) lines.push(`${pad}const _duration = _reducedMotion ? ${reduced} : ${o.duration}`)
  if (body.includes('_stagger')) lines.push(`${pad}const _stagger = _reducedMotion ? 0 : ${o.stagger}`)
  if (body.includes('_delay')) lines.push(`${pad}const _delay = _reducedMotion ? 0 : ${o.delay}`)
  return `${lines.join('\n')}\n\n`
}

function skipGuard(pad: string, returnValue: string): string {
  return `${pad}if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return${returnValue}\n\n`
}

function importLines(plugins: string[], extra: string[] = []): string[] {
  return [...extra, "import gsap from 'gsap'", ...plugins.map((p) => `import { ${p} } from 'gsap/${p}'`)]
}

function registerLine(plugins: string[]): string {
  return plugins.length ? `\ngsap.registerPlugin(${plugins.join(', ')})\n` : ''
}

function withCss(code: string, css?: string): string {
  return css ? `${code}\n/* CSS */\n${css.trim()}\n` : code
}

export function emitVanilla(module: AnimationModule, source: string, o: AnimationOptions, css?: string) {
  const group = reducedMotionGroup(module)
  const body = indent(transformBody(extractBody(source), o, group !== 'skip'), 2)
  const fnName = toCamel(module.id)
  const reducedMotionCode = group === 'skip' ? skipGuard('  ', ' () => {}') : reducedMotionPreamble(group, o, body, '  ')
  const code = `${importLines(module.plugins).join('\n')}\n${registerLine(module.plugins)}
export function ${fnName}(el) {
${reducedMotionCode}${body}
}
`
  return withCss(code, css)
}

/**
 * Emits the zero-dependency snippet from a vanilla.ts source: same
 * #region body / @internal / @emit sentinel pipeline as emitVanilla, plus
 * two extra passes specific to the vanilla path — substituting the
 * precomputed literal ease (LINEAR_EASE_MAP/EASE_POINTS lookups become the
 * actual linear() string or points array for the current ease, computed
 * here at emit time, not read from an import in the snippet) and inlining
 * whichever shared helpers the body actually calls. splitChars/easeAt/
 * scrollScrub have no imports of their own, so inlining them needs no
 * further rewriting — they're appended after the exported function so the
 * animation technique itself is the first thing a reader sees.
 *
 * Handles reduced motion the same way as the live site's useAnimation:
 * loop-tagged and scroll animations skip entirely (see reducedMotionGroup),
 * everything else runs at a near-instant duration (0.35s for the scramble
 * trio, 0.01s otherwise) so it still lands on its true, authored end state
 * instead of a blank or half-applied frame.
 */
export function emitVanillaJS(module: AnimationModule, vanillaSource: string, o: AnimationOptions, css?: string) {
  const group = reducedMotionGroup(module)
  let body = transformBody(extractBody(vanillaSource), o, group !== 'skip')
  body = body
    .replace(/LINEAR_EASE_MAP\['([^']+)'\]\s*\?\?\s*'linear'/g, (_, ease: string) => `'${LINEAR_EASE_MAP[ease] ?? 'linear'}'`)
    .replace(
      /EASE_POINTS\['([^']+)'\]\s*\?\?\s*\[0,\s*1\]/g,
      (_, ease: string) => `[${(EASE_POINTS[ease] ?? [0, 1]).join(', ')}]`,
    )
  body = indent(body, 2)

  const helpers: string[] = []
  if (vanillaSource.includes('splitChars(')) helpers.push(SPLIT_CHARS_SOURCE)
  if (vanillaSource.includes('easeAt(')) helpers.push(EASE_AT_SOURCE)
  if (vanillaSource.includes('scrollScrub(')) helpers.push(SCROLL_SCRUB_SOURCE)

  const fnName = toCamel(module.id)
  const reducedMotionCode = group === 'skip' ? skipGuard('  ', ' () => {}') : reducedMotionPreamble(group, o, body, '  ')
  const code = `export function ${fnName}(el) {
${reducedMotionCode}${body}
}
${helpers.map((h) => `\n${h}\n`).join('')}`
  return withCss(code, css)
}

export function emitReact(
  module: AnimationModule,
  source: string,
  o: AnimationOptions,
  sampleText: string,
  css?: string,
) {
  const group = reducedMotionGroup(module)
  const body = indent(transformBody(extractBody(source), o, group !== 'skip'), 6)
  const fnName = toCamel(module.id)
  const componentName = fnName[0].toUpperCase() + fnName.slice(1)
  const tag = ROLE_TAG[module.roles[0]]
  const reducedMotionCode = group === 'skip' ? skipGuard('    ', '') : reducedMotionPreamble(group, o, body, '    ')
  const code = `${importLines(module.plugins, ["import { useEffect, useRef } from 'react'"]).join('\n')}\n${registerLine(module.plugins)}
export default function ${componentName}({ text = ${JSON.stringify(sampleText)} }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
${reducedMotionCode}    const ctx = gsap.context(() => {
${body}
    }, ref)
    return () => ctx.revert()
  }, [])

  return <${tag} ref={ref}>{text}</${tag}>
}
`
  return withCss(code, css)
}
