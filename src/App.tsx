import { useState, type CSSProperties } from 'react'
import catalog from './animations/registry'
import AnimationCard from './components/AnimationCard'

const DEFAULT_TEXT = 'I Love Bangladesh'
const DENSITIES = [1, 2, 3] as const

function App() {
  const [sampleText, setSampleText] = useState(DEFAULT_TEXT)
  const [density, setDensity] = useState<(typeof DENSITIES)[number]>(1)

  return (
    <div className="min-h-screen px-6 py-16">
      <header className="mx-auto mb-10 max-w-[1100px] text-center">
        <h1 className="text-4xl font-semibold">Kinetic</h1>
        <p className="mt-3 text-sm text-[var(--muted)]">
          Milestone 1 — scaffold, animation contract, and the registry's raw-source pairing,
          proven across three categories.
        </p>
      </header>
      <div className="mx-auto mb-8 flex max-w-[1100px] flex-wrap items-end justify-between gap-4">
        <label className="block max-w-md flex-1 text-left text-xs text-[var(--muted)]">
          Sample text
          <input
            value={sampleText}
            onChange={(e) => setSampleText(e.target.value)}
            className="mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text)]"
          />
        </label>
        <div className="density-toggle" role="group" aria-label="Cards per row">
          {DENSITIES.map((n) => (
            <button
              key={n}
              type="button"
              aria-pressed={density === n}
              onClick={() => setDensity(n)}
            >
              {n}
            </button>
          ))}
        </div>
      </div>
      <main className="k-gallery" style={{ '--density': density } as CSSProperties}>
        {catalog.map((entry) => (
          <AnimationCard key={entry.module.id} entry={entry} sampleText={sampleText} />
        ))}
      </main>
    </div>
  )
}

export default App
