import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Pause, Play } from 'lucide-react'
import catalog from '../animations/registry'
import Stage from '../components/Stage'
import ControlPanel from '../components/ControlPanel'
import CodeTabs from '../components/CodeTabs'
import { useAnimation } from '../lib/useAnimation'
import { ROLE_DEFAULTS } from '../lib/roleDefaults'
import { reactSnippet, setupSnippet, withLiveDefaults } from '../lib/snippets'
import type { AnimationOptions, TextRole } from '../lib/types'

const FIT_RANGES: Record<TextRole, { min: number; max: number }> = {
  heading: { min: 24, max: 96 },
  paragraph: { min: 14, max: 22 },
  button: { min: 14, max: 22 },
  link: { min: 14, max: 22 },
  label: { min: 14, max: 22 },
  counter: { min: 32, max: 96 },
}

export default function Detail() {
  const { id } = useParams<{ id: string }>()
  const index = catalog.findIndex((e) => e.module.id === id)
  const entry = index >= 0 ? catalog[index] : undefined
  const prev = entry ? catalog[(index - 1 + catalog.length) % catalog.length] : undefined
  const next = entry ? catalog[(index + 1) % catalog.length] : undefined

  if (!entry) {
    return (
      <div className="min-h-screen px-6 py-16 text-center">
        <p>Animation not found.</p>
        <Link to="/" className="text-[var(--accent)]">
          Back to gallery
        </Link>
      </div>
    )
  }

  return <DetailView key={entry.module.id} entry={entry} prevId={prev?.module.id} nextId={next?.module.id} />
}

function DetailView({
  entry,
  prevId,
  nextId,
}: {
  entry: (typeof catalog)[number]
  prevId?: string
  nextId?: string
}) {
  const { module, source } = entry
  const defaultText = ROLE_DEFAULTS[module.roles[0]]
  const [inputValue, setInputValue] = useState(defaultText)
  const [sampleText, setSampleText] = useState(defaultText)
  const [options, setOptions] = useState<AnimationOptions>(module.defaults)
  const [replayKey, setReplayKey] = useState(0)
  const isLoop = module.category === 'loop'
  const isHover = module.category === 'hover'
  const [isPlaying, setIsPlaying] = useState(isLoop)

  useEffect(() => {
    const id = setTimeout(() => setSampleText(inputValue), 300)
    return () => clearTimeout(id)
  }, [inputValue])

  const active = isLoop ? isPlaying : true
  const stageKey = `${sampleText}::${JSON.stringify(options)}::${replayKey}`
  const ref = useAnimation<HTMLElement>(
    module,
    options,
    active,
    stageKey,
    FIT_RANGES[module.roles[0]],
    isLoop ? undefined : setIsPlaying,
  )

  const vanilla = withLiveDefaults(source, options)
  const react = reactSnippet(module, sampleText)
  const setup = setupSnippet(module.plugins)

  return (
    <div className="min-h-screen px-6 py-16">
      <div className="mx-auto max-w-[1100px]">
        <Link to="/" className="detail-back">
          ← Back to gallery
        </Link>
        <header className="detail-header">
          <div>
            <h1 className="detail-title">{module.name}</h1>
            <p className="k-chip">{module.category}</p>
          </div>
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
        </header>

        <div className="stage detail-stage">
          <Stage key={stageKey} ref={ref} role={module.roles[0]} text={sampleText} />
        </div>

        <p className="detail-blurb">{module.blurb}</p>

        <div className="detail-grid">
          <div className="detail-panel">
            <label className="block text-left text-xs text-[var(--muted)]">
              Sample text
              <input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text)]"
              />
            </label>
            <ControlPanel options={options} onChange={setOptions} />
          </div>
          <CodeTabs vanilla={vanilla} react={react} setup={setup} />
        </div>

        <nav className="detail-nav">
          {prevId && (
            <Link to={`/a/${prevId}`} className="k-ghost-btn">
              ← Prev
            </Link>
          )}
          {nextId && (
            <Link to={`/a/${nextId}`} className="k-ghost-btn">
              Next →
            </Link>
          )}
        </nav>
      </div>
    </div>
  )
}
