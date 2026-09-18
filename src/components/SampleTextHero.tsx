import { RotateCcw } from 'lucide-react'
import { DEFAULT_SAMPLE_TEXT, SAMPLE_TEXT_MAX } from '../lib/useSampleText'

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
          maxLength={SAMPLE_TEXT_MAX}
          onChange={(e) => onChange(e.target.value)}
          aria-label="Sample text"
          className="hero-input"
        />
        <span className={nearLimit ? 'hero-counter near-limit' : 'hero-counter'}>
          {value.length}/{SAMPLE_TEXT_MAX}
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
