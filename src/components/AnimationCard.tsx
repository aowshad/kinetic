import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Pause, Play } from 'lucide-react'
import Stage from './Stage'
import CodeBlock from './CodeBlock'
import { useAnimation } from '../lib/useAnimation'
import { useInView } from '../lib/useInView'
import type { CatalogEntry, TextRole } from '../lib/types'

const FIT_RANGES: Record<TextRole, { min: number; max: number }> = {
  heading: { min: 16, max: 64 },
  paragraph: { min: 12, max: 18 },
  button: { min: 12, max: 18 },
  link: { min: 12, max: 18 },
  label: { min: 12, max: 18 },
  counter: { min: 20, max: 64 },
}

export default function AnimationCard({
  entry,
  sampleText,
}: {
  entry: CatalogEntry
  sampleText: string
}) {
  const { module, source } = entry
  const navigate = useNavigate()
  const [replayKey, setReplayKey] = useState(0)
  const [showCode, setShowCode] = useState(false)
  const [openedOnce, setOpenedOnce] = useState(false)
  const isLoop = module.category === 'loop'
  const [isPlaying, setIsPlaying] = useState(isLoop)
  const { ref: cardRef, inView } = useInView<HTMLElement>('100% 0px')
  const isHover = module.category === 'hover'
  const active = isLoop ? inView && isPlaying : inView
  const stageKey = `${sampleText}::${replayKey}`
  const ref = useAnimation<HTMLElement>(
    module,
    module.defaults,
    active,
    stageKey,
    FIT_RANGES[module.roles[0]],
    isLoop ? undefined : setIsPlaying,
  )

  const toggleCode = () => {
    setShowCode((v) => !v)
    setOpenedOnce(true)
  }

  return (
    <article ref={cardRef} className="k-card">
      <header className="k-card-header">
        <div className="k-title-group">
          <h3 className="k-card-title">
            <Link to={`/a/${module.id}`}>{module.name}</Link>
          </h3>
          <p className="k-chip">{module.category}</p>
        </div>
        <div className="k-card-actions">
          {isHover ? (
            <span className="k-hint">Hover the text</span>
          ) : isLoop ? (
            <button
              type="button"
              aria-pressed={isPlaying}
              aria-label={`${isPlaying ? 'Pause' : 'Play'} ${module.name} animation`}
              onClick={() => setIsPlaying((v) => !v)}
              className="k-play-btn"
            >
              {isPlaying ? <Pause size={14} /> : <Play size={14} />}
              {isPlaying ? 'Pause' : 'Play'}
            </button>
          ) : (
            <button
              type="button"
              disabled={isPlaying}
              aria-label={`Play ${module.name} animation`}
              onClick={() => setReplayKey((k) => k + 1)}
              className="k-play-btn"
            >
              <Play size={14} />
              {isPlaying ? 'Playing…' : 'Play animation'}
            </button>
          )}
          <button type="button" aria-expanded={showCode} onClick={toggleCode} className="k-ghost-btn">
            {showCode ? 'Hide code' : 'Show code'}
          </button>
        </div>
      </header>
      <div className="stage" onClick={() => navigate(`/a/${module.id}`)}>
        <Stage key={stageKey} ref={ref} role={module.roles[0]} text={sampleText} />
      </div>
      <footer className="k-card-footer" onClick={() => navigate(`/a/${module.id}`)}>
        <p className="k-blurb">{module.blurb}</p>
      </footer>
      <div className="drawer" data-open={showCode}>
        <div className="drawer-inner">{openedOnce && <CodeBlock code={source} />}</div>
      </div>
    </article>
  )
}
