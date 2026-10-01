import { RotateCw } from 'lucide-react'
import { Button } from './components/ui/button'

export const ErrorFallback = ({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) => {
  // In development, rethrow so Vite's overlay shows the full stack.
  if (import.meta.env.DEV) throw error

  return (
    <div className="flex min-h-dvh items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <h1 className="text-xl font-semibold">Something went wrong</h1>
        <p className="mt-2 text-muted-foreground">The page hit an unexpected error. Reloading usually fixes it.</p>
        <pre className="mt-4 max-h-32 overflow-auto rounded-md border bg-muted p-3 text-xs">{error.message}</pre>
        <Button onClick={resetErrorBoundary} variant="outline" className="mt-6 w-full">
          <RotateCw /> Try again
        </Button>
      </div>
    </div>
  )
}
