import { useState } from 'react'
import { RotateCcw } from 'lucide-react'
import Stage from './Stage'
import CodeBlock from './CodeBlock'
import { useAnimation } from '../lib/useAnimation'
import { useInView } from '../lib/useInView'
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
  const [showCode, setShowCode] = useState(false)
  const { ref: cardRef, inView } = useInView<HTMLElement>('100% 0px')
  const stageKey = `${sampleText}::${replayKey}`
  const ref = useAnimation<HTMLElement>(module, module.defaults, inView, [stageKey])

  return (
    <article ref={cardRef} className="k-card">
      <header className="k-card-header">
        <div>
          <h3 className="k-card-title">{module.name}</h3>
          <p className="k-chip">{module.category}</p>
        </div>
        <div className="k-card-actions">
          <button
            type="button"
            aria-label={`Replay ${module.name}`}
            onClick={() => setReplayKey((k) => k + 1)}
            className="k-icon-btn"
          >
            <RotateCcw size={16} />
          </button>
          <button
            type="button"
            aria-expanded={showCode}
            onClick={() => setShowCode((v) => !v)}
            className="k-ghost-btn"
          >
            {showCode ? 'Hide code' : 'Show code'}
          </button>
        </div>
      </header>
      <div className="stage">
        <Stage key={stageKey} ref={ref} role={module.roles[0]} text={sampleText} />
      </div>
      <footer className="k-card-footer">
        <p className="k-blurb">{module.blurb}</p>
      </footer>
      <div className={showCode ? 'code-drawer open' : 'code-drawer'}>
        <div>
          <CodeBlock code={source} />
        </div>
      </div>
    </article>
  )
}
