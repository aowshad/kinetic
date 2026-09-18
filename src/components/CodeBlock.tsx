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
    <div className="relative rounded-lg border border-[var(--border)] bg-[color-mix(in_srgb,var(--bg)_60%,transparent)]">
      <button
        type="button"
        onClick={copy}
        className="absolute right-2 top-2 flex items-center gap-1 rounded-md border border-[var(--border)] px-2 py-1 text-xs text-[var(--muted)] hover:text-[var(--text)]"
      >
        {copied ? <Check size={14} /> : <Copy size={14} />}
        <span aria-live="polite">{copied ? 'Copied' : 'Copy'}</span>
      </button>
      <pre className="max-h-72 overflow-auto p-4 pr-20 text-xs leading-relaxed font-mono">
        <code>{code}</code>
      </pre>
    </div>
  )
}
