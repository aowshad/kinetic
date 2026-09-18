import { useState } from 'react'
import { RotateCcw } from 'lucide-react'
import Stage from './Stage'
import CodeBlock from './CodeBlock'
import { useAnimation } from '../lib/useAnimation'
import type { CatalogEntry } from '../lib/types'

export default function AnimationCard({
  entry,
  sampleText,
}: {
  entry: CatalogEntry
  sampleText: string
}) {
  const { module, source } = entry
  const [replayKey, setReplayKey] = useState(0)
  const stageKey = `${sampleText}::${replayKey}`
  const ref = useAnimation<HTMLElement>(module, module.defaults, [stageKey])

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 transition-colors hover:border-white/20">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium">{module.name}</h3>
          <p className="text-xs text-[var(--muted)] capitalize">{module.category}</p>
        </div>
        <button
          type="button"
          aria-label={`Replay ${module.name}`}
          onClick={() => setReplayKey((k) => k + 1)}
          className="rounded-full border border-[var(--border)] p-2 text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
        >
          <RotateCcw size={16} />
        </button>
      </div>
      <div className="flex min-h-[120px] items-center justify-center overflow-hidden py-6">
        <Stage key={stageKey} ref={ref} role={module.roles[0]} text={sampleText} />
      </div>
      <p className="mt-4 text-xs text-[var(--muted)]">{module.blurb}</p>
      <div className="mt-4">
        <CodeBlock code={source} />
      </div>
    </div>
  )
}
