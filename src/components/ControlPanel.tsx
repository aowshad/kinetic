import { AlignCenter, AlignLeft, AlignRight, RotateCcw } from 'lucide-react'
import EasePicker from './EasePicker'
import { SAMPLE_TEXT_MAX } from '../lib/useSampleText'
import type { AnimationOptions } from '../lib/types'

export type Align = 'left' | 'center' | 'right'

const SLIDER_SPECS = [
  { key: 'duration', label: 'Duration', min: 0.1, max: 3, step: 0.05, decimals: 2 },
  { key: 'stagger', label: 'Stagger', min: 0, max: 0.2, step: 0.005, decimals: 3 },
  { key: 'delay', label: 'Delay', min: 0, max: 2, step: 0.05, decimals: 2 },
] as const

export default function ControlPanel({
  sampleText,
  onSampleTextChange,
  align,
  onAlignChange,
  options,
  defaults,
  onChange,
  onReset,
  onPreviewEase,
}: {
  sampleText: string
  onSampleTextChange: (v: string) => void
  align: Align
  onAlignChange: (a: Align) => void
  options: AnimationOptions
  defaults: AnimationOptions
  onChange: (o: AnimationOptions) => void
  onReset: () => void
  onPreviewEase: (ease: string | null) => void
}) {
  const set = <K extends keyof AnimationOptions>(key: K, value: AnimationOptions[K]) =>
    onChange({ ...options, [key]: value })

  const isDefault = JSON.stringify(options) === JSON.stringify(defaults)

  return (
    <div className="control-bar">
      <div className="control-row-1">
        <label className="control-field control-sample">
          <span>Sample text</span>
          <input
            value={sampleText}
            maxLength={SAMPLE_TEXT_MAX}
            onChange={(e) => onSampleTextChange(e.target.value)}
          />
        </label>

        <div className="control-field">
          <span>Align</span>
          <div className="align-control" role="group" aria-label="Text alignment">
            {(
              [
                ['left', AlignLeft],
                ['center', AlignCenter],
                ['right', AlignRight],
              ] as const
            ).map(([a, Icon]) => (
              <button
                key={a}
                type="button"
                aria-pressed={align === a}
                aria-label={`Align ${a}`}
                title={`Align ${a}`}
                onClick={() => onAlignChange(a)}
                className="align-btn"
              >
                <Icon size={14} />
              </button>
            ))}
          </div>
        </div>

        <div className="control-field control-ease">
          <span>Ease</span>
          <EasePicker value={options.ease} onChange={(v) => set('ease', v)} onPreview={onPreviewEase} />
        </div>
      </div>

      <div className="control-row-2">
        {SLIDER_SPECS.map((spec) => (
          <div key={spec.key} className="control-slider-block">
            <div className="control-slider-head">
              <span>{spec.label}</span>
              <div className="control-number">
                <input
                  type="number"
                  min={spec.min}
                  max={spec.max}
                  step={spec.step}
                  value={options[spec.key].toFixed(spec.decimals)}
                  onChange={(e) => set(spec.key, Number(e.target.value))}
                />
                <span>s</span>
              </div>
            </div>
            <input
              type="range"
              min={spec.min}
              max={spec.max}
              step={spec.step}
              value={options[spec.key]}
              onChange={(e) => set(spec.key, Number(e.target.value))}
              className="control-range"
            />
            <div className="slider-bounds">
              <span>{spec.min}</span>
              <span>{spec.max}</span>
            </div>
          </div>
        ))}
        <button type="button" disabled={isDefault} onClick={onReset} className="k-ghost-btn control-reset">
          <RotateCcw size={13} />
          Reset
        </button>
      </div>
    </div>
  )
}
