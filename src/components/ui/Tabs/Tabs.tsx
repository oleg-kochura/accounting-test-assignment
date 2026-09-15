import { Tabs as RadixTabs } from 'radix-ui'
import type { ReactNode } from 'react'

export interface TabItem<T extends string> {
  id: T
  label: string
  icon: ReactNode
  badge?: string
}

export interface TabsProps<T extends string> {
  items: TabItem<T>[]
  value: T
  onValueChange: (id: T) => void
  'aria-label': string
  children: ReactNode
}

export function Tabs<T extends string>({
  items,
  value,
  onValueChange,
  'aria-label': ariaLabel,
  children,
}: TabsProps<T>) {
  return (
    <RadixTabs.Root
      value={value}
      onValueChange={(id) => onValueChange(id as T)}
    >
      <RadixTabs.List
        aria-label={ariaLabel}
        className="flex gap-6 border-b border-border px-4 lg:px-7"
      >
        {items.map((item) => (
          <RadixTabs.Trigger
            key={item.id}
            value={item.id}
            className="-mb-px flex min-h-11 cursor-pointer items-center gap-2 border-b-2 border-transparent px-0.5 text-base font-medium text-muted-text transition-colors duration-150 hover:border-border-strong hover:text-fg data-[state=active]:border-fg data-[state=active]:text-fg"
          >
            {item.icon}
            {item.label}
            {item.badge ? (
              <span className="ml-0.5 rounded-pill border border-border px-1 py-px text-[8px] leading-[1.4] font-semibold tracking-wide text-muted-text uppercase">
                {item.badge}
              </span>
            ) : null}
          </RadixTabs.Trigger>
        ))}
      </RadixTabs.List>
      {children}
    </RadixTabs.Root>
  )
}

export const TabsContent = RadixTabs.Content
