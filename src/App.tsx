import { useState } from 'react'
import catalog from './animations/registry'
import AnimationCard from './components/AnimationCard'

const DEFAULT_TEXT = 'I Love Bangladesh'

function App() {
  const [sampleText, setSampleText] = useState(DEFAULT_TEXT)

  return (
    <div className="min-h-screen px-6 py-16">
      <header className="mx-auto mb-12 max-w-3xl text-center">
        <h1 className="text-4xl font-semibold">Kinetic</h1>
        <p className="mt-3 text-sm text-[var(--muted)]">
          Milestone 1 — scaffold, animation contract, and the registry's raw-source pairing,
          proven across three categories.
        </p>
        <label className="mx-auto mt-8 block max-w-md text-left text-xs text-[var(--muted)]">
          Sample text
          <input
            value={sampleText}
            onChange={(e) => setSampleText(e.target.value)}
            className="mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text)]"
          />
        </label>
      </header>
      <main className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
        {catalog.map((entry) => (
          <AnimationCard key={entry.module.id} entry={entry} sampleText={sampleText} />
        ))}
      </main>
    </div>
  )
}

export default App
