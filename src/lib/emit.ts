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

function transformBody(rawBody: string, o: AnimationOptions): string {
  return dedent(rawBody)
    .split('\n')
    .filter((line) => !/\/\/\s*@internal\s*$/.test(line))
    .map((line) => {
      const emit = line.match(/^(\s*).*?\s*\/\/\s*@emit:\s*(.+)$/)
      return emit ? `${emit[1]}${emit[2]}` : line
    })
    .join('\n')
    .replace(/\bo\.duration\b/g, String(o.duration))
    .replace(/\bo\.stagger\b/g, String(o.stagger))
    .replace(/\bo\.delay\b/g, String(o.delay))
    .replace(/\bo\.ease\b/g, `'${o.ease}'`)
    .replace(/\s+as const\b/g, '')
    .trim()
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
  const body = indent(transformBody(extractBody(source), o), 2)
  const fnName = toCamel(module.id)
  const code = `${importLines(module.plugins).join('\n')}\n${registerLine(module.plugins)}
export function ${fnName}(el) {
${body}
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
 * scrollScrub have no imports of their own, so inlining them is literally
 * just prepending their source — no further rewriting needed.
 *
 * Also injects a `prefers-reduced-motion` guard as the function's first
 * line: reduced-motion users get the element's untouched static markup
 * (every implementation's default DOM/CSS state is the fully visible end
 * state — nothing here relies on JS to reveal hidden content) instead of
 * the motion effect.
 */
export function emitVanillaJS(module: AnimationModule, vanillaSource: string, o: AnimationOptions, css?: string) {
  let body = transformBody(extractBody(vanillaSource), o)
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
  const code = `${helpers.map((h) => `${h}\n\n`).join('')}export function ${fnName}(el) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {}

${body}
}
`
  return withCss(code, css)
}

export function emitReact(
  module: AnimationModule,
  source: string,
  o: AnimationOptions,
  sampleText: string,
  css?: string,
) {
  const body = indent(transformBody(extractBody(source), o), 6)
  const fnName = toCamel(module.id)
  const componentName = fnName[0].toUpperCase() + fnName.slice(1)
  const tag = ROLE_TAG[module.roles[0]]
  const code = `${importLines(module.plugins, ["import { useEffect, useRef } from 'react'"]).join('\n')}\n${registerLine(module.plugins)}
export default function ${componentName}({ text = ${JSON.stringify(sampleText)} }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ctx = gsap.context(() => {
${body}
    }, ref)
    return () => ctx.revert()
  }, [])

  return <${tag} ref={ref}>{text}</${tag}>
}
`
  return withCss(code, css)
}
