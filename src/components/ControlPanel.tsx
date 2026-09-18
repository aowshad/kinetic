import { EASE_PRESETS } from '../lib/easePresets'
import type { AnimationOptions } from '../lib/types'

export default function ControlPanel({
  options,
  onChange,
}: {
  options: AnimationOptions
  onChange: (o: AnimationOptions) => void
}) {
  const set = <K extends keyof AnimationOptions>(key: K, value: AnimationOptions[K]) =>
    onChange({ ...options, [key]: value })

  return (
    <div className="control-panel">
      <label className="control-row">
        <span>Duration</span>
        <input
          type="range"
          min={0.1}
          max={3}
          step={0.05}
          value={options.duration}
          onChange={(e) => set('duration', Number(e.target.value))}
        />
        <span className="control-value">{options.duration.toFixed(2)}s</span>
      </label>
      <label className="control-row">
        <span>Stagger</span>
        <input
          type="range"
          min={0}
          max={0.2}
          step={0.005}
          value={options.stagger}
          onChange={(e) => set('stagger', Number(e.target.value))}
        />
        <span className="control-value">{options.stagger.toFixed(3)}s</span>
      </label>
      <label className="control-row">
        <span>Delay</span>
        <input
          type="range"
          min={0}
          max={2}
          step={0.05}
          value={options.delay}
          onChange={(e) => set('delay', Number(e.target.value))}
        />
        <span className="control-value">{options.delay.toFixed(2)}s</span>
      </label>
      <label className="control-row">
        <span>Ease</span>
        <select value={options.ease} onChange={(e) => set('ease', e.target.value)}>
          {EASE_PRESETS.map((e) => (
            <option key={e} value={e}>
              {e}
            </option>
          ))}
        </select>
      </label>
    </div>
  )
}
