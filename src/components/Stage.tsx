import { forwardRef } from 'react'
import type { TextRole } from '../lib/types'

interface StageProps {
  role: TextRole
  text: string
}

const Stage = forwardRef<HTMLElement, StageProps>(({ role, text }, ref) => {
  switch (role) {
    case 'heading':
      return (
        <h2 ref={ref as React.Ref<HTMLHeadingElement>} className="stage-heading font-semibold">
          {text}
        </h2>
      )
    case 'paragraph':
      return (
        <p ref={ref as React.Ref<HTMLParagraphElement>} className="stage-paragraph">
          {text}
        </p>
      )
    case 'button':
      return (
        <button
          ref={ref as React.Ref<HTMLButtonElement>}
          type="button"
          className="stage-button rounded-md border border-[var(--border)] px-5 py-3"
        >
          {text}
        </button>
      )
    case 'counter':
      return (
        <span ref={ref as React.Ref<HTMLSpanElement>} className="stage-counter font-mono">
          {text}
        </span>
      )
    default:
      return <span ref={ref as React.Ref<HTMLSpanElement>}>{text}</span>
  }
})

Stage.displayName = 'Stage'

export default Stage
