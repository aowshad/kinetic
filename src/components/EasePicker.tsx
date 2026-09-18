import { useEffect, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { easeCurvePath } from '../lib/easeCurve'

const GROUPS = [
  { label: 'Standard', eases: ['none', 'power1.out', 'power1.inOut', 'power2.out', 'power2.inOut', 'power3.out', 'power3.inOut', 'power4.out'] },
  { label: 'Expressive', eases: ['expo.out', 'circ.out', 'sine.inOut'] },
  { label: 'Overshoot', eases: ['back.out(1.7)', 'elastic.out(1, 0.3)', 'bounce.out'] },
]
const ALL_EASES = GROUPS.flatMap((g) => g.eases)
const labelFor = (e: string) => (e === 'none' ? 'linear (none)' : e)

export default function EasePicker({
  value,
  onChange,
  onPreview,
}: {
  value: string
  onChange: (v: string) => void
  onPreview: (v: string | null) => void
}) {
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(() => Math.max(0, ALL_EASES.indexOf(value)))
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDocClick = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [open])

  const move = (delta: number) => {
    setActiveIndex((i) => Math.min(ALL_EASES.length - 1, Math.max(0, i + delta)))
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (!open) setOpen(true)
      else move(1)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      move(-1)
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      if (open) {
        onChange(ALL_EASES[activeIndex])
        onPreview(null)
        setOpen(false)
      } else {
        setOpen(true)
      }
    } else if (e.key === 'Escape') {
      setOpen(false)
      onPreview(null)
    }
  }

  return (
    <div ref={rootRef} className="ease-picker">
      <button
        type="button"
        className="ease-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={onKeyDown}
      >
        <svg viewBox="0 0 28 28" width="18" height="18" aria-hidden="true">
          <path d={easeCurvePath(value)} fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
        {labelFor(value)}
        <ChevronDown size={14} />
      </button>
      {open && (
        <div
          role="listbox"
          aria-activedescendant={`ease-opt-${activeIndex}`}
          className="ease-popover"
          tabIndex={-1}
          onMouseLeave={() => onPreview(null)}
        >
          {GROUPS.map((group) => (
            <div key={group.label} className="ease-group">
              <span className="ease-group-label">{group.label}</span>
              {group.eases.map((ease) => {
                const index = ALL_EASES.indexOf(ease)
                return (
                  <div
                    key={ease}
                    id={`ease-opt-${index}`}
                    role="option"
                    aria-selected={value === ease}
                    className={index === activeIndex ? 'ease-option active' : 'ease-option'}
                    onMouseEnter={() => {
                      setActiveIndex(index)
                      onPreview(ease)
                    }}
                    onClick={() => {
                      onChange(ease)
                      onPreview(null)
                      setOpen(false)
                    }}
                  >
                    <svg viewBox="0 0 28 28" width="24" height="24" aria-hidden="true">
                      <path d={easeCurvePath(ease)} fill="none" stroke="currentColor" strokeWidth="2" />
                    </svg>
                    {labelFor(ease)}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
