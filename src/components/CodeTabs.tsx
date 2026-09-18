import { useState } from 'react'
import { Check, Copy } from 'lucide-react'

type Tab = 'vanilla' | 'react' | 'setup'

const LABELS: Record<Tab, string> = { vanilla: 'Vanilla JS', react: 'React', setup: 'Setup' }
const TABS: Tab[] = ['vanilla', 'react', 'setup']

export default function CodeTabs({
  vanilla,
  react,
  setup,
}: {
  vanilla: string
  react: string
  setup: string
}) {
  const [tab, setTab] = useState<Tab>('vanilla')
  const [copied, setCopied] = useState(false)
  const code = tab === 'vanilla' ? vanilla : tab === 'react' ? react : setup

  const copy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="detail-code">
      <div className="detail-code-bar">
        <div role="tablist" className="detail-tabs">
          {TABS.map((t) => (
            <button
              key={t}
              type="button"
              role="tab"
              aria-selected={tab === t}
              onClick={() => setTab(t)}
              className="detail-tab-btn"
            >
              {LABELS[t]}
            </button>
          ))}
        </div>
        <button type="button" onClick={copy} className="code-copy-btn">
          {copied ? <Check size={13} /> : <Copy size={13} />}
          <span aria-live="polite">{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
      <pre className="code-pre">
        <code>{code}</code>
      </pre>
    </div>
  )
}
