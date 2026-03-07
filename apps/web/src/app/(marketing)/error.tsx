'use client'
 
export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="rounded border border-destructive/20 bg-destructive/10 p-4">
      <h2 className="mb-2 font-semibold text-lg text-destructive">
        Something went wrong
      </h2>
      <p className="mb-4 text-muted-foreground text-sm">{error.message}</p>
      <button
        type="button"
        onClick={reset}
        className="rounded bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/80"
      >
        Try again
      </button>
    </div>
  )
}
