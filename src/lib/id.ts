// crypto.randomUUID is only exposed in secure contexts (HTTPS or
// localhost). Opening the dev server over plain HTTP on a LAN — e.g. from
// a phone at http://192.168.x.x:5173 — leaves it undefined, so callers
// that need a unique id (a React key and removal handle for a new line
// item) fall back to a non-cryptographic id instead of throwing.
export function generateId(): string {
  if (typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}
