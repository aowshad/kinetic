import type { AnimationModule, CatalogEntry } from '../lib/types'

const modules = import.meta.glob<{ default: AnimationModule }>('./**/*.ts', { eager: true })
const sources = import.meta.glob<string>('./**/*.ts', {
  eager: true,
  query: '?raw',
  import: 'default',
})
const styles = import.meta.glob<string>('./**/*.css', {
  eager: true,
  query: '?raw',
  import: 'default',
})

const catalog: CatalogEntry[] = Object.entries(modules)
  .filter(([path]) => !path.endsWith('/registry.ts'))
  .map(([path, mod]) => ({
    module: mod.default,
    source: sources[path],
    css: styles[path.replace(/\.ts$/, '.css')],
    path,
  }))
  .sort((a, b) => a.module.name.localeCompare(b.module.name))

export default catalog
