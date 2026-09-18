import { RotateCcw } from 'lucide-react'

const MAX_LENGTH = 120
export const DEFAULT_SAMPLE_TEXT = 'I Love Bangladesh'

export default function SampleTextHero({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  const nearLimit = value.length >= 100

  return (
    <div className="hero">
      <div className="hero-field">
        <input
          value={value}
          maxLength={MAX_LENGTH}
          onChange={(e) => onChange(e.target.value)}
          aria-label="Sample text"
          className="hero-input"
        />
        <span className={nearLimit ? 'hero-counter near-limit' : 'hero-counter'}>
          {value.length}/{MAX_LENGTH}
        </span>
        {value !== DEFAULT_SAMPLE_TEXT && (
          <button
            type="button"
            onClick={() => onChange(DEFAULT_SAMPLE_TEXT)}
            aria-label="Reset sample text"
            title="Reset sample text"
            className="hero-reset"
          >
            <RotateCcw size={14} />
          </button>
        )}
      </div>
      <p className="hero-hint">Type anything — every animation updates live.</p>
    </div>
  )
}
