import { useState } from 'react'
import { EditorSidebar } from '../EditorSidebar'
import { EditorFooter } from '../EditorFooter'
import { InvoicePreview } from '../../invoice-preview/InvoicePreview'
import { MOCK_INVOICE } from '../../invoice-preview/mockInvoice'
import {
  selectIsDirty,
  useInvoiceTemplateStore,
} from '../../../store/useInvoiceTemplateStore'
import type { MobileView } from './types'

export function TemplateCustomizer() {
  const draft = useInvoiceTemplateStore((s) => s.draft)
  const isDirty = useInvoiceTemplateStore(selectIsDirty)
  const [mobileView, setMobileView] = useState<MobileView>('customize')

  return (
    <main className="flex min-h-screen flex-col lg:grid lg:h-screen lg:grid-cols-[520px_1fr]">
      <div className="sticky top-0 z-10 flex items-center justify-between gap-2 border-b border-border bg-surface px-4 py-2 lg:hidden">
        <span
          className={`inline-flex items-center gap-1.5 rounded-pill px-2.5 py-1.5 text-sm font-medium whitespace-nowrap ${
            isDirty
              ? 'bg-warn-soft text-warn-ink'
              : 'bg-fg-soft text-muted-text'
          }`}
        >
          <span
            aria-hidden="true"
            className={`h-1.5 w-1.5 rounded-full ${isDirty ? 'bg-warn-ink' : 'bg-border-strong'}`}
          />
          {isDirty ? 'Unsaved' : 'Saved'}
        </span>
        <button
          type="button"
          onClick={() =>
            setMobileView((v) => (v === 'customize' ? 'preview' : 'customize'))
          }
          className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-pill border border-border-strong bg-surface px-3 text-md font-medium text-fg hover:bg-fg-softer"
        >
          {mobileView === 'customize' ? (
            <>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-[15px] w-[15px] flex-none"
                aria-hidden="true"
              >
                <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              <span>Preview</span>
            </>
          ) : (
            <>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-[15px] w-[15px] flex-none"
                aria-hidden="true"
              >
                <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
              </svg>
              <span>Edit</span>
            </>
          )}
        </button>
      </div>

      <section
        aria-labelledby="customize-title"
        className={`flex-col border-b border-border bg-surface lg:flex lg:min-h-0 lg:border-r lg:border-b-0 ${
          mobileView === 'customize' ? 'flex' : 'hidden'
        }`}
      >
        <div className="flex items-baseline justify-between gap-3 px-4 pt-4 pb-2.5 lg:px-7 lg:pt-4.5">
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
        tabIndex={0}
        className={`flex-col bg-bg lg:flex lg:min-h-0 lg:overflow-y-auto ${
          mobileView === 'preview' ? 'flex' : 'hidden'
        }`}
      >
        <div className="flex items-baseline justify-between gap-3 px-4 pt-4 pb-2.5 lg:px-7 lg:pt-4.5">
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
        <div className="flex-1 overflow-x-auto pt-3.5 pb-12 lg:flex lg:items-start lg:justify-center lg:overflow-visible lg:px-10">
          <div className="inline-block px-4 lg:contents">
            <div className="w-[680px] max-w-none lg:w-full lg:max-w-[760px]">
              <InvoicePreview template={draft} invoice={MOCK_INVOICE} />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
