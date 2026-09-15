import { Switch } from 'radix-ui'
import type { ToggleProps } from './types'

export function Toggle({ id, checked, onChange, children }: ToggleProps) {
  return (
    <label className="inline-flex min-h-9 cursor-pointer items-center gap-2.5 rounded-sm px-1 text-md font-medium whitespace-nowrap text-fg">
      <Switch.Root
        id={id}
        checked={checked}
        onCheckedChange={onChange}
        className="relative h-5 w-9 flex-none rounded-pill bg-border-strong transition-colors duration-150 data-[state=checked]:bg-fg"
      >
        <Switch.Thumb className="absolute top-0.5 left-0.5 block h-4 w-4 rounded-full bg-surface transition-transform duration-150 data-[state=checked]:translate-x-4" />
      </Switch.Root>
      {children}
    </label>
  )
}
