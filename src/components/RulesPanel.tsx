import { useState } from 'react'

type Props = {
  rules: string[]
}

export function RulesPanel({ rules }: Props) {
  const [open, setOpen] = useState(false)
  if (!rules.length) return null

  return (
    <section className="rules">
      <button
        type="button"
        className="rules-toggle"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span>抽奖活动说明</span>
        <span className="chevron" data-open={open ? 'true' : 'false'} aria-hidden="true">
          ▾
        </span>
      </button>
      {open && (
        <ol className="rules-list">
          {rules.map((rule) => (
            <li key={rule.slice(0, 24)}>{rule}</li>
          ))}
        </ol>
      )}
    </section>
  )
}
