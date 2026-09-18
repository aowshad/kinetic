import { useState } from 'react'
import { Check, Copy } from 'lucide-react'

type Tab = 'vanilla' | 'react' | 'source'

const LABELS: Record<Tab, string> = { vanilla: 'Vanilla JS', react: 'React', source: 'Source' }
const TABS: Tab[] = ['vanilla', 'react', 'source']

export default function CodeTabs({
  vanilla,
  react,
  source,
}: {
  vanilla: string
  react: string
  source: string
}) {
  const [tab, setTab] = useState<Tab>('vanilla')
  const [copied, setCopied] = useState(false)
  const code = tab === 'vanilla' ? vanilla : tab === 'react' ? react : source

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
      {tab === 'source' && <p className="source-label">Internal source — for contributors</p>}
      <pre className="code-pre">
        <code>{code}</code>
      </pre>
    </div>
  )
}
