import { useState, type ChangeEvent, type FocusEvent } from 'react'

const HEX_PATTERN = /^#[0-9a-fA-F]{6}$/

export interface ColorFieldProps {
  id: string
  label: string
  hint: string
  errorHint: string
  value: string
  onChange: (hex: string) => void
}

export function ColorField({
  id,
  label,
  hint,
  errorHint,
  value,
  onChange,
}: ColorFieldProps) {
  const [draftText, setDraftText] = useState(value)
  const [invalid, setInvalid] = useState(false)
  const [prevValue, setPrevValue] = useState(value)

  // Follow the store's value whenever it changes externally (e.g. Cancel,
  // or a valid commit this field itself made). Typing an invalid value
  // never changes `value`, so this doesn't fight with the handlers below.
  // Adjusted during render (React's documented pattern for resetting state
  // when a prop changes) rather than in a useEffect, since the latter trips
  // the react-hooks/set-state-in-effect lint rule.
  if (value !== prevValue) {
    setPrevValue(value)
    setDraftText(value)
    setInvalid(false)
  }

  function commitIfValid(next: string) {
    const trimmed = next.trim()
    if (HEX_PATTERN.test(trimmed)) {
      setInvalid(false)
      onChange(trimmed.toLowerCase())
    } else {
      setInvalid(true)
    }
  }

  function handlePickerChange(e: ChangeEvent<HTMLInputElement>) {
    const hex = e.target.value.toLowerCase()
    setDraftText(hex)
    setInvalid(false)
    onChange(hex)
  }

  function handleTextChange(e: ChangeEvent<HTMLInputElement>) {
    setDraftText(e.target.value)
    commitIfValid(e.target.value)
  }

  function handleBlur(e: FocusEvent<HTMLInputElement>) {
    const trimmed = e.target.value.trim()
    if (HEX_PATTERN.test(trimmed)) {
      setDraftText(trimmed.toLowerCase())
      setInvalid(false)
    }
  }

  return (
    <div className="grid grid-cols-[1fr_auto] items-center gap-x-3 rounded-lg border border-border p-2.5 px-3 lg:flex lg:flex-col lg:gap-1.5">
      <span className="col-start-1 row-start-1 text-md font-medium text-fg">
        {label}
      </span>
      <div className="col-start-2 row-start-1 row-span-2 flex items-center gap-2">
        <span
          className="relative h-11 w-11 flex-none overflow-hidden rounded-sm border border-border-strong"
          style={{ backgroundColor: value }}
        >
          <input
            type="color"
            value={value}
            onChange={handlePickerChange}
            aria-label={`Pick ${label.toLowerCase()} color`}
            className="absolute inset-0 h-full w-full cursor-pointer border-0 p-0 opacity-0"
          />
        </span>
        <input
          id={id}
          type="text"
          maxLength={7}
          autoComplete="off"
          spellCheck={false}
          value={draftText}
          onChange={handleTextChange}
          onBlur={handleBlur}
          aria-label={`${label} color hex`}
          className={`min-h-11 w-28 rounded-sm border px-3 font-mono text-md lowercase tracking-wide text-fg outline-none focus:border-accent focus:shadow-[0_0_0_3px_var(--color-accent-soft)] lg:w-full ${
            invalid ? 'border-fg' : 'border-border-strong'
          }`}
        />
      </div>
      {invalid ? (
        <span
          role="alert"
          className="col-start-1 row-start-2 text-sm font-medium text-fg"
        >
          {errorHint}
        </span>
      ) : (
        <span className="col-start-1 row-start-2 text-sm text-muted-text">
          {hint}
        </span>
      )}
    </div>
  )
}
