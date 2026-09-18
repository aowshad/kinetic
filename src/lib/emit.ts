import type { AnimationModule, AnimationOptions, TextRole } from './types'

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
