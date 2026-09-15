import { Tabs, TabsContent, type TabItem } from '../../../components/ui/Tabs'
import { useInvoiceTemplateStore } from '../../../store/useInvoiceTemplateStore'
import type { EditorTab } from '../../../types/invoiceTemplate'
import { GeneralTab } from '../GeneralTab'
import { ContentTab } from '../ContentTab'

const TAB_ITEMS: TabItem<EditorTab>[] = [
  {
    id: 'general',
    label: 'General',
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4 flex-none"
        aria-hidden="true"
      >
        <path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6" />
      </svg>
    ),
  },
  {
    id: 'content',
    label: 'Content',
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4 flex-none"
        aria-hidden="true"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
      </svg>
    ),
  },
]

export function EditorSidebar() {
  const activeTab = useInvoiceTemplateStore((s) => s.activeTab)
  const setActiveTab = useInvoiceTemplateStore((s) => s.setActiveTab)

  return (
    <div className="flex min-h-0 flex-1 flex-col lg:overflow-y-auto">
      <Tabs
        items={TAB_ITEMS}
        value={activeTab}
        onValueChange={setActiveTab}
        aria-label="Template sections"
      >
        <TabsContent value="general">
          <GeneralTab />
        </TabsContent>
        <TabsContent value="content">
          <ContentTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
