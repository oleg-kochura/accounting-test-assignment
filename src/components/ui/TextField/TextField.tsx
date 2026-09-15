import type { TextFieldProps } from './types'

export function TextField({ id, label, hint, error, ...rest }: TextFieldProps) {
  const invalid = Boolean(error)
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-md font-medium text-fg">
        {label}
      </label>
      <input
        id={id}
        className={`min-h-11 w-full rounded-sm border px-3 text-base text-fg outline-none transition-colors duration-150 placeholder:text-muted-text focus:border-accent focus:shadow-[0_0_0_3px_var(--color-accent-soft)] ${
          invalid ? 'border-fg' : 'border-border-strong hover:border-fg/50'
        }`}
        aria-invalid={invalid}
        {...rest}
      />
      {invalid ? (
        <span role="alert" className="text-sm font-medium text-fg">
          {error}
        </span>
      ) : hint ? (
        <span className="text-sm text-muted-text">{hint}</span>
      ) : null}
    </div>
  )
}
