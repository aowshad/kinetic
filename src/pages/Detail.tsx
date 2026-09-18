import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Check, Link2, Play, Repeat } from 'lucide-react'
import catalog from '../animations/registry'
import Stage from '../components/Stage'
import ControlPanel, { type Align } from '../components/ControlPanel'
import CodeTabs from '../components/CodeTabs'
import { useAnimation } from '../lib/useAnimation'
import { useSampleText } from '../lib/useSampleText'
import { emitReact, emitVanilla } from '../lib/emit'
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

  return <DetailView key={entry.module.id} entry={entry} prev={prev} next={next} />
}

function DetailView({
  entry,
  prev,
  next,
}: {
  entry: (typeof catalog)[number]
  prev?: (typeof catalog)[number]
  next?: (typeof catalog)[number]
}) {
  const { module, source, css } = entry
  const [sampleText, setSampleText] = useSampleText()
  const [align, setAlign] = useState<Align>('center')
  const [options, setOptions] = useState<AnimationOptions>(module.defaults)
  const [previewEase, setPreviewEase] = useState<string | null>(null)
  const [replayKey, setReplayKey] = useState(0)
  const [autoLoop, setAutoLoop] = useState(false)
  const isHover = module.category === 'hover'
  const [isPlaying, setIsPlaying] = useState(false)
  const [linkCopied, setLinkCopied] = useState(false)

  useEffect(() => {
    if (!autoLoop) return
    const id = setInterval(() => setReplayKey((k) => k + 1), 1200)
    return () => clearInterval(id)
  }, [autoLoop])

  const effectiveOptions: AnimationOptions = { ...options, ease: previewEase ?? options.ease }
  const stageKey = `${sampleText}::${JSON.stringify(effectiveOptions)}::${replayKey}`
  const ref = useAnimation<HTMLElement>(
    module,
    effectiveOptions,
    true,
    stageKey,
    FIT_RANGES[module.roles[0]],
    setIsPlaying,
  )

  const vanilla = emitVanilla(module, source, options, css)
  const react = emitReact(module, source, options, sampleText, css)

  const copyLink = async () => {
    await navigator.clipboard.writeText(`${location.origin}${location.pathname}#/a/${module.id}`)
    setLinkCopied(true)
    setTimeout(() => setLinkCopied(false), 2000)
  }

  return (
    <div className="min-h-screen px-6 py-16">
      <div className="mx-auto max-w-[1100px]">
        <div className="detail-topbar">
          <Link to="/" className="detail-back">
            ← Back to gallery
          </Link>
          <button type="button" onClick={copyLink} className="k-ghost-btn">
            {linkCopied ? <Check size={13} /> : <Link2 size={13} />}
            {linkCopied ? 'Copied' : 'Copy link'}
          </button>
        </div>

        <div className="detail-title-row">
          <div className="detail-title-group">
            <h1 className="detail-title">{module.name}</h1>
            <span className="k-chip">{module.category}</span>
            {module.plugins.map((p) => (
              <span key={p} className="plugin-badge" title="Included free in GSAP 3.13+">
                {p}
              </span>
            ))}
          </div>
          <div className="detail-actions">
            {isHover ? (
              <span className="k-hint">Hover the text</span>
            ) : (
              <>
                <button
                  type="button"
                  disabled={isPlaying}
                  aria-label={`Play ${module.name} animation`}
                  onClick={() => setReplayKey((k) => k + 1)}
                  className="k-play-btn"
                >
                  <Play size={14} />
                  {isPlaying ? 'Playing…' : 'Play'}
                </button>
                <button
                  type="button"
                  aria-pressed={autoLoop}
                  aria-label="Loop playback every 1.2s"
                  title="Loop playback every 1.2s"
                  onClick={() => setAutoLoop((v) => !v)}
                  className="k-play-btn"
                >
                  <Repeat size={14} />
                  Loop
                </button>
              </>
            )}
          </div>
        </div>
        <p className="detail-blurb">{module.blurb}</p>

        <div className="stage detail-stage" style={{ justifyItems: align === 'left' ? 'start' : align === 'right' ? 'end' : 'center', textAlign: align }}>
          <Stage key={stageKey} ref={ref} role={module.roles[0]} text={sampleText} />
        </div>

        <ControlPanel
          sampleText={sampleText}
          onSampleTextChange={setSampleText}
          align={align}
          onAlignChange={setAlign}
          options={options}
          defaults={module.defaults}
          onChange={setOptions}
          onReset={() => setOptions(module.defaults)}
          onPreviewEase={setPreviewEase}
        />

        <CodeTabs vanilla={vanilla} react={react} source={source} />

        <nav className="detail-nav">
          {prev && (
            <Link to={`/a/${prev.module.id}`} className="k-ghost-btn">
              ← {prev.module.name}
            </Link>
          )}
          {next && (
            <Link to={`/a/${next.module.id}`} className="k-ghost-btn">
              {next.module.name} →
            </Link>
          )}
        </nav>
      </div>
    </div>
  )
}
