import { useEffect, useMemo, useState } from 'react'
import catalog from './animations/registry'
import AnimationCard from './components/AnimationCard'
import FilterBar from './components/FilterBar'
import type { Category, TextRole } from './lib/types'

const DEFAULT_TEXT = 'I Love Bangladesh'
const THEME_KEY = 'kinetic-theme'

function App() {
  const [inputValue, setInputValue] = useState(DEFAULT_TEXT)
  const [sampleText, setSampleText] = useState(DEFAULT_TEXT)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<Category | 'all'>('all')
  const [role, setRole] = useState<TextRole | 'all'>('all')
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      return localStorage.getItem(THEME_KEY) === 'light' ? 'light' : 'dark'
    } catch {
      return 'dark'
    }
  })

  useEffect(() => {
    const id = setTimeout(() => setSampleText(inputValue), 300)
    return () => clearTimeout(id)
  }, [inputValue])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    try {
      localStorage.setItem(THEME_KEY, theme)
    } catch {
      // ignore
    }
  }, [theme])

  const categories = useMemo(
    () => Array.from(new Set(catalog.map((e) => e.module.category))),
    [],
  )
  const roles = useMemo(
    () => Array.from(new Set(catalog.flatMap((e) => e.module.roles))),
    [],
  )

  const filtered = catalog.filter((entry) => {
    const q = search.trim().toLowerCase()
    const matchesSearch =
      !q || entry.module.name.toLowerCase().includes(q) || entry.module.blurb.toLowerCase().includes(q)
    const matchesCategory = category === 'all' || entry.module.category === category
    const matchesRole = role === 'all' || entry.module.roles.includes(role)
    return matchesSearch && matchesCategory && matchesRole
  })

  return (
    <div className="min-h-screen px-6 py-16">
      <header className="mx-auto mb-10 max-w-[1100px] text-center">
        <h1 className="text-4xl font-semibold">Kinetic</h1>
        <p className="mt-3 text-sm text-[var(--muted)]">
          Milestone 1 — scaffold, animation contract, and the registry's raw-source pairing,
          proven across three categories.
        </p>
      </header>
      <div className="mx-auto mb-6 max-w-[1100px]">
        <label className="block max-w-md text-left text-xs text-[var(--muted)]">
          Sample text
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text)]"
          />
        </label>
      </div>
      <FilterBar
        search={search}
        onSearchChange={setSearch}
        categories={categories}
        category={category}
        onCategoryChange={setCategory}
        roles={roles}
        role={role}
        onRoleChange={setRole}
        theme={theme}
        onThemeToggle={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
      />
      <main className="k-gallery">
        {filtered.map((entry) => (
          <AnimationCard key={entry.module.id} entry={entry} sampleText={sampleText} />
        ))}
        {filtered.length === 0 && <p className="k-empty">No animations match those filters.</p>}
      </main>
    </div>
  )
}

export default App
