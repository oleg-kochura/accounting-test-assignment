export function ContentTab() {
  return (
    <div
      role="tabpanel"
      id="panel-content"
      aria-labelledby="tab-content"
      tabIndex={0}
      className="px-7 pt-5 pb-6"
    >
      <div className="rounded-lg border border-dashed border-border-strong px-6 py-10 text-center text-muted-text">
        <strong className="mb-1 block font-semibold text-fg">
          Coming soon
        </strong>
        Content settings are not available yet. Your General changes are kept
        while you look around.
      </div>
    </div>
  )
}
