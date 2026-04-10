import { Download } from 'lucide-react'

interface ResultCardProps {
  blobUrl: string
  onReset: () => void
}

export function ResultCard({ blobUrl, onReset }: ResultCardProps) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-lg border border-border
      bg-accent/30 p-6 text-center">
      <div className="flex flex-col items-center gap-1">
        <p className="text-base font-semibold text-foreground">
          Your ATS CV is ready!
        </p>
        <p className="text-sm text-muted-foreground">
          Download it and use it in your job applications.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
        <a
          href={blobUrl}
          download="ats-cv.pdf"
          className="inline-flex items-center justify-center gap-2 rounded-md
            bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground
            transition-colors hover:bg-primary/90"
        >
          <Download className="h-4 w-4" aria-hidden="true" />
          Download ATS CV
        </a>

        {/* Re-download — US3: reuses stored blobUrl without a new API call */}
        <a
          href={blobUrl}
          download="ats-cv.pdf"
          className="inline-flex items-center justify-center gap-2 rounded-md
            border border-border bg-background px-5 py-2.5 text-sm font-medium
            text-foreground transition-colors hover:bg-accent"
        >
          <Download className="h-4 w-4" aria-hidden="true" />
          Download Again
        </a>
      </div>

      <button
        type="button"
        onClick={onReset}
        className="text-xs text-muted-foreground underline-offset-2 hover:underline"
      >
        Convert another CV
      </button>
    </div>
  )
}
