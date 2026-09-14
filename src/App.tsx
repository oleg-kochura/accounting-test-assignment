import { useCounterStore } from './store/useCounterStore'

function App() {
  const { count, increment, decrement, reset } = useCounterStore()

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-50 text-gray-900">
      <h1 className="text-3xl font-semibold">accounting-test-assignment</h1>
      <p className="text-gray-500">React + TypeScript + Tailwind + Zustand</p>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={decrement}
          className="rounded-md bg-gray-200 px-4 py-2 font-medium hover:bg-gray-300"
        >
          −
        </button>
        <span className="w-12 text-center text-xl font-mono">{count}</span>
        <button
          type="button"
          onClick={increment}
          className="rounded-md bg-gray-200 px-4 py-2 font-medium hover:bg-gray-300"
        >
          +
        </button>
      </div>

      <button
        type="button"
        onClick={reset}
        className="text-sm text-gray-400 underline hover:text-gray-600"
      >
        Reset
      </button>
    </main>
  )
}

export default App
