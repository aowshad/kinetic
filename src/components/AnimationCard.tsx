import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, Link2, Pause, Play } from 'lucide-react'
import Stage from './Stage'
import CodeTabs from './CodeTabs'
import { useAnimation } from '../lib/useAnimation'
import { useInView } from '../lib/useInView'
import { usePrefersReducedMotion } from '../lib/usePrefersReducedMotion'
import { emitReact, emitVanilla, emitVanillaJS } from '../lib/emit'
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
  onEngineChange,
}: {
  entry: CatalogEntry
  sampleText: string
  engine: Engine
  onEngineChange: (e: Engine) => void
}) {
  const { module, source, vanillaSource, css } = entry
  const [replayKey, setReplayKey] = useState(0)
  const [showCode, setShowCode] = useState(false)
  const [openedOnce, setOpenedOnce] = useState(false)
  const [linkCopied, setLinkCopied] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [scrolledDemo, setScrolledDemo] = useState(false)
  const hintSeenRef = useRef(false)
  const isLoop = module.category === 'loop'
  const [isPlaying, setIsPlaying] = useState(isLoop)
  const { ref: cardRef, inView } = useInView<HTMLElement>('100% 0px')
  const isHover = module.category === 'hover'
  const isScroll = module.category === 'scroll'
  const prefersReducedMotion = usePrefersReducedMotion()
  const loopBlocked = prefersReducedMotion && module.reducedMotion === 'skip'
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

  const jsGsap = openedOnce ? emitVanilla(module, source, module.defaults, css) : ''
  const react = openedOnce ? emitReact(module, source, module.defaults, sampleText, css) : ''
  const js = openedOnce && vanillaSource ? emitVanillaJS(module, vanillaSource, module.defaults, css) : null

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
            {module.vanilla === 'partial' && (
              <span className="k-deps-badge k-deps-badge-partial" title={module.vanillaNote}>
                Partial
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
          ) : isScroll ? null : isLoop ? (
            <button
              type="button"
              disabled={loopBlocked}
              aria-pressed={isPlaying}
              aria-label={loopBlocked ? 'Playback disabled — reduced motion is on' : `${isPlaying ? 'Pause' : 'Play'} ${module.name} animation`}
              title={loopBlocked ? 'This loops forever, so it stays off while reduced motion is on' : undefined}
              onClick={() => setIsPlaying((v) => !v)}
              className="k-play-btn"
            >
              {isPlaying ? <Pause size={14} /> : <Play size={14} />}
              {loopBlocked ? 'Reduced motion' : isPlaying ? 'Pause' : 'Play'}
            </button>
          ) : (
            <button
              type="button"
              disabled={isPlaying || loopBlocked}
              aria-label={loopBlocked ? 'Replay disabled — reduced motion is on' : `Play ${module.name} animation`}
              title={loopBlocked ? 'This loops forever, so replay stays off while reduced motion is on' : undefined}
              onClick={replay}
              className="k-play-btn"
            >
              <Play size={14} />
              {loopBlocked ? 'Reduced motion' : isPlaying ? 'Playing…' : 'Play'}
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
      {isScroll ? (
        <div className="stage stage-scroll">
          <div
            className="scroll-demo-track"
            data-scroll-demo
            onScroll={() => {
              if (!scrolledDemo) setScrolledDemo(true)
            }}
          >
            <div className="scroll-demo-pad" aria-hidden="true" />
            <Stage key={stageKey} ref={ref} role={module.roles[0]} text={sampleText} />
            <div className="scroll-demo-pad" aria-hidden="true" />
          </div>
          <span className="stage-hint stage-hint-scroll" data-faded={scrolledDemo}>
            Scroll inside this box
          </span>
        </div>
      ) : (
        <div
          className={isHover ? 'stage' : 'stage stage-clickable'}
          onClick={isHover ? undefined : replay}
          onMouseEnter={isHover ? undefined : onStageMouseEnter}
        >
          <Stage key={stageKey} ref={ref} role={module.roles[0]} text={sampleText} />
          {showHint && <span className="stage-hint">Click to replay</span>}
        </div>
      )}
      <div className="drawer" data-open={showCode}>
        <div className="drawer-inner">
          {openedOnce && (
            <CodeTabs
              js={js}
              jsGsap={jsGsap}
              react={react}
              source={source}
              vanilla={module.vanilla}
              vanillaNote={module.vanillaNote}
              engine={engine}
              onEngineChange={onEngineChange}
            />
          )}
        </div>
      </div>
    </article>
  )
}
