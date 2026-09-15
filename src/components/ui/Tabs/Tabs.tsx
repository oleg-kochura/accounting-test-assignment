import type { KeyboardEvent, ReactNode } from 'react'

export interface TabItem<T extends string> {
  id: T
  label: string
  icon: ReactNode
  badge?: string
}

export interface TabsProps<T extends string> {
  items: TabItem<T>[]
  activeId: T
  onChange: (id: T) => void
  'aria-label': string
}

export function Tabs<T extends string>({
  items,
  activeId,
  onChange,
  'aria-label': ariaLabel,
}: TabsProps<T>) {
  function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
    e.preventDefault()
    const index = items.findIndex((item) => item.id === activeId)
    const nextIndex =
      e.key === 'ArrowRight'
        ? (index + 1) % items.length
        : (index - 1 + items.length) % items.length
    onChange(items[nextIndex].id)
  }

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      onKeyDown={handleKeyDown}
      className="flex gap-6 border-b border-border px-7"
    >
      {items.map((item) => {
        const selected = item.id === activeId
        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            id={`tab-${item.id}`}
            aria-selected={selected}
            aria-controls={`panel-${item.id}`}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(item.id)}
            className={`-mb-px flex min-h-11 items-center gap-2 border-b-2 px-0.5 text-base font-medium transition-colors duration-150 ${
              selected
                ? 'border-fg text-fg'
                : 'border-transparent text-muted-text hover:border-border-strong hover:text-fg'
            }`}
          >
            {item.icon}
            {item.label}
            {item.badge ? (
              <span className="ml-0.5 rounded-pill border border-border px-1.5 py-px text-2xs font-semibold tracking-widest text-muted-text uppercase">
                {item.badge}
              </span>
            ) : null}
          </button>
        )
      })}
    </div>
  )
}
