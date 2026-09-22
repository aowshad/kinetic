import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import type { VanillaTier } from '../lib/types'

type Tab = 'js' | 'jsGsap' | 'react' | 'source'

const LABELS: Record<Tab, string> = { js: 'JS', jsGsap: 'JS + GSAP', react: 'React', source: 'Source' }

export default function CodeTabs({
  js,
  jsGsap,
  react,
  source,
  vanilla,
  vanillaNote,
}: {
  js: string | null
  jsGsap: string
  react: string
  source: string
  vanilla: VanillaTier
  vanillaNote?: string
}) {
  const tabs: Tab[] = js !== null ? ['js', 'jsGsap', 'react', 'source'] : ['jsGsap', 'react', 'source']
  const [tab, setTab] = useState<Tab>(js !== null ? 'js' : 'jsGsap')
  const [copied, setCopied] = useState(false)
  const code = tab === 'js' ? (js ?? '') : tab === 'jsGsap' ? jsGsap : tab === 'react' ? react : source

  const copy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="detail-code">
      <div className="detail-code-bar">
        <div role="tablist" className="detail-tabs">
          {tabs.map((t) => (
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
      {tab === 'js' && vanilla === 'partial' && vanillaNote && <p className="vanilla-note">{vanillaNote}</p>}
      {tab === 'source' && <p className="source-label">Internal source — for contributors</p>}
      <pre className="code-pre">
        <code>{code}</code>
      </pre>
    </div>
  )
}
