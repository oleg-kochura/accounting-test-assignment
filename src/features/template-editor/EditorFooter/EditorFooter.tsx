import { useEffect, useRef, useState } from 'react'
import { Button } from '../../../components/ui/Button'
import {
  selectIsDirty,
  selectIsValid,
  useInvoiceTemplateStore,
} from '../../../store/useInvoiceTemplateStore'

const CONFIRMATION_MS = 2500

export function EditorFooter() {
  const isDirty = useInvoiceTemplateStore(selectIsDirty)
  const isValid = useInvoiceTemplateStore(selectIsValid)
  const save = useInvoiceTemplateStore((s) => s.save)
  const cancel = useInvoiceTemplateStore((s) => s.cancel)

  const [showConfirmation, setShowConfirmation] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    },
    [],
  )

  function handleSave() {
    save()
    setShowConfirmation(true)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(
      () => setShowConfirmation(false),
      CONFIRMATION_MS,
    )
  }

  function handleCancel() {
    if (timerRef.current) clearTimeout(timerRef.current)
    setShowConfirmation(false)
    cancel()
  }

  const statusText = showConfirmation
    ? 'Template saved'
    : isDirty
      ? 'Unsaved changes'
      : 'No unsaved changes'
  const dotColor = showConfirmation
    ? 'bg-accent'
    : isDirty
      ? 'bg-warn-ink'
      : 'bg-border-strong'

  return (
    <footer className="mt-auto flex items-center justify-between gap-3 border-t border-border px-4 py-3 lg:px-7 lg:py-3.5">
      <div className="hidden items-center gap-2 text-md text-muted-text lg:flex">
        <span
          aria-hidden="true"
          className={`h-1.5 w-1.5 rounded-full ${dotColor}`}
        />
        <span aria-live="polite">{statusText}</span>
      </div>
      <div className="flex w-full gap-2 lg:w-auto">
        <div className="flex-1 [&>button]:w-full lg:flex-none lg:[&>button]:w-auto">
          <Button
            variant="secondary"
            disabled={!isDirty}
            onClick={handleCancel}
          >
            Cancel
          </Button>
        </div>
        <div className="flex-1 [&>button]:w-full lg:flex-none lg:[&>button]:w-auto">
          <Button
            variant="primary"
            disabled={!(isDirty && isValid)}
            onClick={handleSave}
          >
            Save template
          </Button>
        </div>
      </div>
    </footer>
  )
}
