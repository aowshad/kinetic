import { useEffect, useMemo, useRef, useState } from 'react'
import { Check, Copy } from 'lucide-react'
import pkg from '../../package.json'
import catalog from '../animations/registry'
import AnimationCard from '../components/AnimationCard'
import FilterBar from '../components/FilterBar'
import SampleTextHero from '../components/SampleTextHero'
import ThemeControl from '../components/ThemeControl'
import { useSampleText } from '../lib/useSampleText'
import { SITE_DESCRIPTION, SITE_TITLE, useDocumentMeta } from '../lib/useDocumentMeta'
import { usePreviewEngine } from '../lib/usePreviewEngine'
import type { Category } from '../lib/types'
import type { ThemeMode } from '../lib/useTheme'

const CATEGORY_ORDER: Category[] = ['entrance', 'kinetic', 'scroll', 'hover', 'loop', 'exit']
const GSAP_VERSION = (pkg.dependencies.gsap as string).replace(/^[^0-9]*/, '')

export default function Gallery({
  theme,
  onThemeToggle,
}: {
  theme: ThemeMode
  onThemeToggle: (m: ThemeMode) => void
}) {
  const [sampleText, setSampleText] = useSampleText()
  const [engine, setEngine] = usePreviewEngine()
  const [inputValue, setInputValue] = useState(sampleText)
  const [search, setSearch] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([])
  const [installCopied, setInstallCopied] = useState(false)

  useDocumentMeta({ title: SITE_TITLE, description: SITE_DESCRIPTION, path: '', image: 'og/default.png' })

  useEffect(() => {
    const id = setTimeout(() => setSampleText(inputValue), 300)
    return () => clearTimeout(id)
  }, [inputValue])

  const searchFiltered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return catalog
    return catalog.filter(
      (e) => e.module.name.toLowerCase().includes(q) || e.module.blurb.toLowerCase().includes(q),
    )
  }, [search])

  const presentCategories = useMemo(
    () => CATEGORY_ORDER.filter((c) => catalog.some((e) => e.module.category === c)),
    [],
  )

  const categoryCounts = presentCategories.map((value) => ({
    value,
    count: searchFiltered.filter((e) => e.module.category === value).length,
  }))

  const filtered = searchFiltered.filter(
    (e) => selectedCategories.length === 0 || selectedCategories.includes(e.module.category),
  )

  const hasActiveFilters = search.length > 0 || selectedCategories.length > 0

  const clearFilters = () => {
    setSearch('')
    setSelectedCategories([])
  }

  const toggleCategory = (c: Category) =>
    setSelectedCategories((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]))

  const groups = presentCategories
    .map((category) => ({ category, entries: filtered.filter((e) => e.module.category === category) }))
    .filter((g) => g.entries.length > 0)

  const sectionRefs = useRef(new Map<string, HTMLDivElement>())

  const zeroDepCount = useMemo(() => catalog.filter((e) => e.module.vanilla !== 'none').length, [])
  const fullDepCount = useMemo(() => catalog.filter((e) => e.module.vanilla === 'full').length, [])

  const copyInstall = async () => {
    await navigator.clipboard.writeText('npm i gsap')
    setInstallCopied(true)
    setTimeout(() => setInstallCopied(false), 2000)
  }

  return (
    <div className="min-h-screen px-6 py-8">
      <a href="#main" className="skip-link">
        Skip to animations
      </a>

      <header className="page-header">
        <div className="page-header-top">
          <div>
            <h1 className="page-title">Kinetic</h1>
            <p className="page-subtitle">
              {catalog.length} copy-paste text animations. {zeroDepCount} of {catalog.length} run with zero
              dependencies — {fullDepCount} at full fidelity, {zeroDepCount - fullDepCount} with minor caveats
              on older browsers. We tell you which is which.
            </p>
          </div>
          <div className="page-header-controls">
            <ThemeControl mode={theme} onChange={onThemeToggle} />
          </div>
        </div>
        <div className="page-header-badges">
          <button type="button" onClick={copyInstall} className="badge-btn">
            {installCopied ? <Check size={12} /> : <Copy size={12} />}
            npm i gsap · v{GSAP_VERSION}
          </button>
          <a
            href="https://github.com/aowshad/kinetic"
            target="_blank"
            rel="noreferrer"
            className="badge-link"
          >
            GitHub ↗
          </a>
        </div>
      </header>

      <SampleTextHero value={inputValue} onChange={setInputValue} />

      <FilterBar
        search={search}
        onSearchChange={setSearch}
        categories={categoryCounts}
        selectedCategories={selectedCategories}
        onToggleCategory={toggleCategory}
        onClear={clearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {hasActiveFilters && (
        <p className="result-count" aria-live="polite">
          Showing {filtered.length} of {catalog.length} animations
        </p>
      )}

      <main id="main" className="k-gallery">
        {groups.map(({ category, entries }) => (
          <div
            key={category}
            id={`section-${category}`}
            ref={(el) => {
              if (el) sectionRefs.current.set(category, el)
              else sectionRefs.current.delete(category)
            }}
            className="section-group"
          >
            <h2 className="section-heading">
              {category} <span>· {entries.length}</span>
            </h2>
            {entries.map((entry) => (
              <AnimationCard key={entry.module.id} entry={entry} sampleText={sampleText} engine={engine} onEngineChange={setEngine} />
            ))}
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="k-empty">
            <p>No animations match those filters.</p>
            <button type="button" onClick={clearFilters} className="filter-clear">
              Clear filters
            </button>
          </div>
        )}
      </main>

      <footer className="page-footer">
        <span>MIT licence</span>
        <a href="https://github.com/aowshad/kinetic" target="_blank" rel="noreferrer">
          Contribute
        </a>
        <a href="https://gsap.com" target="_blank" rel="noreferrer">
          Built with GSAP
        </a>
      </footer>
    </div>
  )
}
