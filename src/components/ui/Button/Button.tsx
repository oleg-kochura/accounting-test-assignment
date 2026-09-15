import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'
type ButtonSize = 'md' | 'sm'

export interface ButtonProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'className'
> {
  variant?: ButtonVariant
  size?: ButtonSize
  children: ReactNode
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: 'bg-accent-ink text-surface border-accent-ink hover:brightness-90',
  secondary:
    'bg-surface text-fg border-border-strong hover:border-fg hover:bg-fg-softer',
  ghost: 'bg-transparent text-fg border-transparent hover:bg-fg-soft px-2.5',
}

const SIZE_CLASSES: Record<ButtonSize, string> = {
  md: 'min-h-11 px-4.5 text-base',
  sm: 'min-h-9 px-3 text-md',
}

export function Button({
  variant = 'primary',
  size = 'md',
  type = 'button',
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-sm border font-medium tracking-normal transition-colors duration-150 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-45 ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]}`}
      {...rest}
    >
      {children}
    </button>
  )
}
