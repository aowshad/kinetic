import { useEffect, useState } from 'react'
import catalog from './animations/registry'
import AnimationCard from './components/AnimationCard'

const DEFAULT_TEXT = 'I Love Bangladesh'

function App() {
  const [inputValue, setInputValue] = useState(DEFAULT_TEXT)
  const [sampleText, setSampleText] = useState(DEFAULT_TEXT)

  useEffect(() => {
    const id = setTimeout(() => setSampleText(inputValue), 300)
    return () => clearTimeout(id)
  }, [inputValue])

  return (
    <div className="min-h-screen px-6 py-16">
      <header className="mx-auto mb-10 max-w-[1100px] text-center">
        <h1 className="text-4xl font-semibold">Kinetic</h1>
        <p className="mt-3 text-sm text-[var(--muted)]">
          Milestone 1 — scaffold, animation contract, and the registry's raw-source pairing,
          proven across three categories.
        </p>
      </header>
      <div className="mx-auto mb-8 max-w-[1100px]">
        <label className="block max-w-md text-left text-xs text-[var(--muted)]">
          Sample text
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text)]"
          />
        </label>
      </div>
      <main className="k-gallery">
        {catalog.map((entry) => (
          <AnimationCard key={entry.module.id} entry={entry} sampleText={sampleText} />
        ))}
      </main>
    </div>
  )
}

export default App
