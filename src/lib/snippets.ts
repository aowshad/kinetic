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

export function reactSnippet(module: AnimationModule, sampleText: string) {
  const varName = toCamel(module.id)
  const tag = ROLE_TAG[module.roles[0]]
  const extraProps = tag === 'button' ? ' type="button"' : tag === 'a' ? ' href="#"' : ''
  return `import { useEffect, useRef } from 'react'
import ${varName} from './animations/${module.category}/${module.id}'

export default function Demo() {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const result = ${varName}.run(ref.current, ${varName}.defaults)
    return typeof result === 'function' ? result : () => result.kill()
  }, [])

  return <${tag} ref={ref}${extraProps}>${sampleText}</${tag}>
}
`
}

export function setupSnippet(plugins: string[]) {
  const gsapImport = "import { gsap } from 'gsap'"
  if (!plugins.length) return `npm install gsap\n\n${gsapImport}`
  const imports = plugins.map((p) => `import { ${p} } from 'gsap/${p}'`).join('\n')
  return `npm install gsap\n\n${gsapImport}\n${imports}\n\ngsap.registerPlugin(${plugins.join(', ')})`
}

export function withLiveDefaults(source: string, o: AnimationOptions) {
  const formatted = `{ duration: ${o.duration}, stagger: ${o.stagger}, delay: ${o.delay}, ease: '${o.ease}' }`
  return source.replace(/defaults:\s*\{[^}]*\}/, `defaults: ${formatted}`)
}
