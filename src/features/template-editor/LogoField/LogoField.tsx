import { useRef, useState, type ChangeEvent, type DragEvent } from 'react'
import { Button } from '../../../components/ui/Button'
import { useInvoiceTemplateStore } from '../../../store/useInvoiceTemplateStore'

const ACCEPTED_TYPES = [
  'image/png',
  'image/jpeg',
  'image/svg+xml',
  'image/webp',
]
const MAX_BYTES = 1024 * 1024

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

export function LogoField() {
  const showLogo = useInvoiceTemplateStore((s) => s.draft.branding.showLogo)
  const logo = useInvoiceTemplateStore((s) => s.draft.branding.logo)
  const primaryColor = useInvoiceTemplateStore(
    (s) => s.draft.branding.primaryColor,
  )
  const updateBranding = useInvoiceTemplateStore((s) => s.updateBranding)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState('')
  const [isOver, setIsOver] = useState(false)

  function acceptFile(file: File | undefined) {
    if (!file) return
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError('That file type is not supported. Use PNG, JPG, SVG or WebP.')
      return
    }
    if (file.size > MAX_BYTES) {
      setError(`File is ${formatBytes(file.size)} — the limit is 1 MB.`)
      return
    }
    const reader = new FileReader()
    reader.onerror = () =>
      setError('The file could not be read. Try another file.')
    reader.onload = () => {
      setError('')
      updateBranding({
        logo: {
          name: file.name,
          size: file.size,
          dataUrl: reader.result as string,
        },
      })
    }
    reader.readAsDataURL(file)
  }

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    acceptFile(e.target.files?.[0])
    e.target.value = ''
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setIsOver(false)
    acceptFile(e.dataTransfer.files[0])
  }

  function openFilePicker() {
    fileInputRef.current?.click()
  }

  const hiddenSuffix = showLogo ? '' : ' · hidden on invoice'

  return (
    <div className="flex flex-col gap-1.5">
      <div
        onDragEnter={(e) => {
          e.preventDefault()
          setIsOver(true)
        }}
        onDragOver={(e) => {
          e.preventDefault()
          setIsOver(true)
        }}
        onDragLeave={(e) => {
          e.preventDefault()
          setIsOver(false)
        }}
        onDrop={handleDrop}
        className={`grid min-h-27 grid-cols-[72px_1fr_auto] items-center gap-3.5 rounded-lg border p-4 transition-colors duration-150 ${
          isOver
            ? 'border-solid border-accent bg-accent-soft'
            : logo
              ? 'border-solid border-border bg-surface'
              : 'border-dashed border-border-strong bg-fg-softer'
        }`}
      >
        <button
          type="button"
          title="Choose a logo file"
          onClick={openFilePicker}
          className={`grid h-18 w-18 place-items-center overflow-hidden rounded-sm ${
            logo ? 'border border-border bg-fg-softer' : ''
          }`}
        >
          {logo ? (
            <img
              src={logo.dataUrl}
              alt={logo.name}
              className="max-h-16 max-w-16 object-contain"
            />
          ) : (
            <div
              aria-label="Placeholder logo"
              style={{ backgroundColor: primaryColor }}
              className="grid h-14 w-14 place-items-center rounded-md font-display text-2xl font-bold tracking-tighter text-surface"
            >
              BC
            </div>
          )}
        </button>

        <div className="flex min-w-0 flex-col gap-0.5 text-md">
          {logo ? (
            <>
              <span className="truncate font-medium">{logo.name}</span>
              <span className="text-sm text-muted-text">
                {formatBytes(logo.size)}
                {hiddenSuffix}
              </span>
            </>
          ) : (
            <>
              <span className="font-medium">
                Drop a logo here or{' '}
                <button
                  type="button"
                  onClick={openFilePicker}
                  className="font-medium text-fg underline decoration-border-strong underline-offset-3 hover:decoration-fg"
                >
                  browse
                </button>
              </span>
              <span className="text-sm text-muted-text">
                PNG, JPG, SVG or WebP · up to 1 MB{hiddenSuffix}
              </span>
            </>
          )}
        </div>

        {logo ? (
          <div className="flex gap-1">
            <Button variant="secondary" size="sm" onClick={openFilePicker}>
              Replace
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setError('')
                updateBranding({ logo: null })
              }}
            >
              Remove
            </Button>
          </div>
        ) : null}

        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_TYPES.join(',')}
          onChange={handleInputChange}
          className="sr-only"
        />
      </div>
      {error ? (
        <span role="alert" className="text-sm font-medium text-fg">
          {error}
        </span>
      ) : null}
    </div>
  )
}
