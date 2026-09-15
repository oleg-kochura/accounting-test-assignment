import type { ReactNode } from 'react'

export interface ToggleProps {
  id?: string
  checked: boolean
  onChange: (checked: boolean) => void
  children: ReactNode
}

export function Toggle({ id, checked, onChange, children }: ToggleProps) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="inline-flex min-h-9 cursor-pointer items-center gap-2.5 rounded-sm bg-transparent px-1 text-md font-medium whitespace-nowrap text-fg"
    >
      <span
        aria-hidden="true"
        className={`relative h-5 w-9 flex-none rounded-pill transition-colors duration-150 ${checked ? 'bg-fg' : 'bg-border-strong'}`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-surface transition-transform duration-150 ${checked ? 'translate-x-4' : ''}`}
        />
      </span>
      {children}
    </button>
  )
}
