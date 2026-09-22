import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Check, Link2, Play, Repeat } from 'lucide-react'
import catalog from '../animations/registry'
import Stage from '../components/Stage'
import ControlPanel, { type Align } from '../components/ControlPanel'
import CodeTabs from '../components/CodeTabs'
import EngineControl from '../components/EngineControl'
import { useAnimation } from '../lib/useAnimation'
import { useSampleText } from '../lib/useSampleText'
import { usePreviewEngine } from '../lib/usePreviewEngine'
import { usePrefersReducedMotion } from '../lib/usePrefersReducedMotion'
import { emitReact, emitVanilla, emitVanillaJS } from '../lib/emit'
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
  const { module, source, vanillaSource, css } = entry
  const [sampleText, setSampleText] = useSampleText()
  const [engine, setEngine] = usePreviewEngine()
  const [align, setAlign] = useState<Align>('center')
  const [options, setOptions] = useState<AnimationOptions>(module.defaults)
  const [previewEase, setPreviewEase] = useState<string | null>(null)
  const [replayKey, setReplayKey] = useState(0)
  const [autoLoop, setAutoLoop] = useState(false)
  const isHover = module.category === 'hover'
  const isScroll = module.category === 'scroll'
  const [isPlaying, setIsPlaying] = useState(false)
  const [linkCopied, setLinkCopied] = useState(false)
  const prefersReducedMotion = usePrefersReducedMotion()
  const loopBlocked = prefersReducedMotion && (module.category === 'loop' || module.tags.includes('loop'))

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
    engine,
    setIsPlaying,
  )

  const jsGsap = emitVanilla(module, source, options, css)
  const react = emitReact(module, source, options, sampleText, css)
  const js = vanillaSource ? emitVanillaJS(module, vanillaSource, options, css) : null

  const copyLink = async () => {
    await navigator.clipboard.writeText(`${location.origin}${location.pathname}#/a/${module.id}`)
    setLinkCopied(true)
    setTimeout(() => setLinkCopied(false), 2000)
  }

  return (
    <div className="min-h-screen px-6 py-16">
      <div className="mx-auto max-w-[1100px]">
        <div className="detail-topbar">
          <Link to="/" className="k-ghost-btn">
            <ArrowLeft size={13} />
            Back to gallery
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
            {module.vanilla === 'full' && (
              <span className="k-deps-badge k-deps-badge-full" title="Runs on the Web Animations API — no GSAP needed">
                No deps
              </span>
            )}
            {module.vanilla === 'partial' && (
              <span className="k-deps-badge k-deps-badge-partial" title={module.vanillaNote}>
                No deps*
              </span>
            )}
            {module.vanilla === 'none' && (
              <span className="k-deps-badge k-deps-badge-none" title={module.vanillaNote ?? 'Needs GSAP'}>
                GSAP
              </span>
            )}
            {module.plugins.map((p) => (
              <span key={p} className="plugin-badge" title="Included free in GSAP 3.13+">
                {p}
              </span>
            ))}
          </div>
        </div>
        <p className="detail-blurb">{module.blurb}</p>
        {module.vanilla === 'none' && (
          <p className="needs-gsap-note">{module.vanillaNote ?? 'Needs GSAP — no zero-dependency equivalent for this animation.'}</p>
        )}

        <div className="stage detail-stage" style={{ justifyItems: align === 'left' ? 'start' : align === 'right' ? 'end' : 'center', textAlign: align }}>
          <Stage key={stageKey} ref={ref} role={module.roles[0]} text={sampleText} />
        </div>
        {engine === 'vanilla' && module.vanilla === 'partial' && module.vanillaNote && (
          <p className="stage-note">{module.vanillaNote}</p>
        )}
        <div className="stage-toolbar">
          <div className="stage-toolbar-left">
            {module.vanilla !== 'none' && <EngineControl engine={engine} onChange={setEngine} />}
          </div>
          <div className="stage-toolbar-right">
            {isHover ? (
              <span className="k-hint">Hover the text</span>
            ) : isScroll ? (
              <span className="k-hint">Scroll the page</span>
            ) : (
              <>
                <button
                  type="button"
                  disabled={isPlaying || loopBlocked}
                  aria-label={loopBlocked ? 'Replay disabled — reduced motion is on' : `Play ${module.name} animation`}
                  title={loopBlocked ? 'This loops forever, so replay stays off while reduced motion is on' : undefined}
                  onClick={() => setReplayKey((k) => k + 1)}
                  className="k-play-btn"
                >
                  <Play size={14} />
                  {loopBlocked ? 'Reduced motion' : isPlaying ? 'Playing…' : 'Play'}
                </button>
                <button
                  type="button"
                  disabled={loopBlocked}
                  aria-pressed={autoLoop}
                  aria-label={loopBlocked ? 'Loop playback disabled — reduced motion is on' : 'Loop playback every 1.2s'}
                  title={loopBlocked ? 'Reduced motion is on' : 'Loop playback every 1.2s'}
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

        <CodeTabs
          js={js}
          jsGsap={jsGsap}
          react={react}
          source={source}
          vanilla={module.vanilla}
          vanillaNote={module.vanillaNote}
          engine={engine}
          onEngineChange={setEngine}
        />

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
