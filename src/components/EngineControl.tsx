import type { Engine } from '../lib/usePreviewEngine'

const OPTIONS: { engine: Engine; label: string }[] = [
  { engine: 'vanilla', label: 'JS' },
  { engine: 'gsap', label: 'GSAP' },
]

export default function EngineControl({
  engine,
  onChange,
}: {
  engine: Engine
  onChange: (e: Engine) => void
}) {
  return (
    <div className="engine-control" role="radiogroup" aria-label="Preview engine">
      {OPTIONS.map(({ engine: e, label }) => (
        <button
          key={e}
          type="button"
          role="radio"
          aria-checked={engine === e}
          aria-pressed={engine === e}
          title={e === 'vanilla' ? 'Preview the zero-dependency JS' : 'Preview the GSAP version'}
          onClick={() => onChange(e)}
          className="engine-control-btn"
        >
          {label}
        </button>
      ))}
    </div>
  )
}
