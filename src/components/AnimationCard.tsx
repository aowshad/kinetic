import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, Link2, Pause, Play } from 'lucide-react'
import Stage from './Stage'
import CodeBlock from './CodeBlock'
import { useAnimation } from '../lib/useAnimation'
import { useInView } from '../lib/useInView'
import type { Engine } from '../lib/usePreviewEngine'
import type { CatalogEntry, TextRole } from '../lib/types'

const FIT_RANGES: Record<TextRole, { min: number; max: number }> = {
  heading: { min: 16, max: 56 },
  paragraph: { min: 12, max: 16 },
  button: { min: 12, max: 16 },
  link: { min: 12, max: 16 },
  label: { min: 12, max: 16 },
  counter: { min: 18, max: 56 },
}

export default function AnimationCard({
  entry,
  sampleText,
  engine,
}: {
  entry: CatalogEntry
  sampleText: string
  engine: Engine
}) {
  const { module, source } = entry
  const [replayKey, setReplayKey] = useState(0)
  const [showCode, setShowCode] = useState(false)
  const [openedOnce, setOpenedOnce] = useState(false)
  const [linkCopied, setLinkCopied] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const hintSeenRef = useRef(false)
  const isLoop = module.category === 'loop'
  const [isPlaying, setIsPlaying] = useState(isLoop)
  const { ref: cardRef, inView } = useInView<HTMLElement>('100% 0px')
  const isHover = module.category === 'hover'
  const isScroll = module.category === 'scroll'
  const active = isLoop ? inView && isPlaying : inView
  const stageKey = `${sampleText}::${replayKey}`
  const ref = useAnimation<HTMLElement>(
    module,
    module.defaults,
    active,
    stageKey,
    FIT_RANGES[module.roles[0]],
    engine,
    isLoop ? undefined : setIsPlaying,
  )

  const toggleCode = () => {
    setShowCode((v) => !v)
    setOpenedOnce(true)
  }

  const copyLink = async () => {
    const url = `${location.origin}${location.pathname}#/a/${module.id}`
    await navigator.clipboard.writeText(url)
    setLinkCopied(true)
    setTimeout(() => setLinkCopied(false), 2000)
  }

  const replay = () => {
    if (isPlaying) return
    setReplayKey((k) => k + 1)
  }

  const onStageMouseEnter = () => {
    if (hintSeenRef.current) return
    hintSeenRef.current = true
    setShowHint(true)
    setTimeout(() => setShowHint(false), 1600)
  }

  return (
    <article ref={cardRef} id={module.id} className="k-card">
      <div className="k-card-meta">
        <div className="k-card-header">
          <div className="k-title-group">
            <h3 className="k-card-title">
              <Link to={`/a/${module.id}`}>{module.name}</Link>
            </h3>
            <p className="k-chip">{module.category}</p>
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
          </div>
          <button
            type="button"
            onClick={copyLink}
            aria-label="Copy link to this animation"
            title={linkCopied ? 'Copied' : 'Copy link to this animation'}
            className="k-icon-btn"
          >
            {linkCopied ? <Check size={14} /> : <Link2 size={14} />}
          </button>
        </div>
        <p className="k-blurb">{module.blurb}</p>
        <div className="k-card-actions">
          {isHover ? (
            <span className="k-hint">Hover the text</span>
          ) : isScroll ? (
            <span className="k-hint">Scroll the page</span>
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
              onClick={replay}
              className="k-play-btn"
            >
              <Play size={14} />
              {isPlaying ? 'Playing…' : 'Play'}
            </button>
          )}
          <button type="button" aria-expanded={showCode} onClick={toggleCode} className="k-ghost-btn">
            {showCode ? 'Hide code' : 'Show code'}
          </button>
          <Link to={`/a/${module.id}`} className="k-ghost-btn">
            Open ↗
          </Link>
        </div>
      </div>
      <div
        className={isHover || isScroll ? 'stage' : 'stage stage-clickable'}
        onClick={isHover || isScroll ? undefined : replay}
        onMouseEnter={isHover || isScroll ? undefined : onStageMouseEnter}
      >
        <Stage key={stageKey} ref={ref} role={module.roles[0]} text={sampleText} />
        {showHint && <span className="stage-hint">Click to replay</span>}
      </div>
      {engine === 'vanilla' && module.vanilla === 'partial' && module.vanillaNote && (
        <p className="stage-note">{module.vanillaNote}</p>
      )}
      <div className="drawer" data-open={showCode}>
        <div className="drawer-inner">{openedOnce && <CodeBlock code={source} />}</div>
      </div>
    </article>
  )
}
