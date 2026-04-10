import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'

interface ProgressSpinnerProps {
  isPending: boolean
}

export function ProgressSpinner({ isPending }: ProgressSpinnerProps) {
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    if (!isPending) {
      setElapsed(0)
      return
    }

    setElapsed(0)
    const interval = setInterval(() => {
      setElapsed(prev => prev + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [isPending])

  if (!isPending) return null

  return (
    <div className="flex flex-col items-center gap-3 py-6" role="status" aria-live="polite">
      <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden="true" />
      <p className="text-sm text-muted-foreground">
        Converting your CV… {elapsed}s elapsed
      </p>
      <p className="text-xs text-muted-foreground">
        This may take up to 90 seconds
      </p>
    </div>
  )
}
