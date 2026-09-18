import { useState } from 'react'
import { Check, Copy } from 'lucide-react'

export default function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="code-drawer-scroll">
      <div className="code-drawer-bar">
        <span>ts</span>
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
