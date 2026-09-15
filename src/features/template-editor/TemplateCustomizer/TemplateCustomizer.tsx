import { EditorSidebar } from '../EditorSidebar'
import { EditorFooter } from '../EditorFooter'
import { InvoicePreview } from '../../invoice-preview/InvoicePreview'
import { MOCK_INVOICE } from '../../invoice-preview/mockInvoice'
import { useInvoiceTemplateStore } from '../../../store/useInvoiceTemplateStore'

export function TemplateCustomizer() {
  const draft = useInvoiceTemplateStore((s) => s.draft)

  return (
    <main className="flex min-h-screen flex-col lg:grid lg:h-screen lg:grid-cols-[520px_1fr]">
      <section
        aria-labelledby="customize-title"
        className="flex flex-col border-b border-border bg-surface lg:border-r lg:border-b-0"
      >
        <div className="flex items-baseline justify-between gap-3 px-7 pt-4.5 pb-2.5">
          <h1
            id="customize-title"
            className="text-3xl leading-snug font-semibold tracking-tight"
          >
            Customize
          </h1>
          <span className="text-sm text-muted-text">
            Changes apply to the preview instantly
          </span>
        </div>
        <EditorSidebar />
        <EditorFooter />
      </section>

      <section
        aria-labelledby="preview-title"
        className="flex flex-col bg-bg lg:overflow-y-auto"
      >
        <div className="flex items-baseline justify-between gap-3 px-7 pt-4.5 pb-2.5">
          <h2
            id="preview-title"
            className="text-3xl leading-snug font-semibold tracking-tight"
          >
            Preview
          </h2>
          <span className="text-sm text-muted-text">
            Sample invoice · figures are illustrative
          </span>
        </div>
        <div className="flex flex-1 items-start justify-center px-10 pt-3.5 pb-12">
          <div className="w-full max-w-[760px]">
            <InvoicePreview template={draft} invoice={MOCK_INVOICE} />
          </div>
        </div>
      </section>
    </main>
  )
}
