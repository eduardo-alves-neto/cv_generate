import { useState } from 'react'
import { ConvertForm } from '../components/ConvertForm'
import { ProgressSteps } from '../components/ProgressSteps'
import { ResultCard } from '../components/ResultCard'

type Stage = 'idle' | 'pending' | 'success' | 'error'

export function HomePage() {
  const [stage, setStage] = useState<Stage>('idle')
  const [blobUrl, setBlobUrl] = useState<string | null>(null)

  function handleReset() {
    setBlobUrl(null)
    setStage('idle')
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-primary/5 to-background px-4 pb-16 pt-10 sm:pt-16">
      <div className="mx-auto w-full max-w-4xl">
        {/* Form card */}
        {stage !== 'success' && (
          <>
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <ConvertForm
                onConvertStart={() => setStage('pending')}
                onConvertSuccess={(url) => {
                  setBlobUrl(url)
                  setStage('success')
                }}
                onConvertError={() => setStage('error')}
              />
            </div>

            {/* Progress steps — rendered outside the card so it stays above the fold on mobile */}
            {stage !== 'idle' && (
              <div className="mt-4 rounded-xl border border-border bg-card px-6 py-2 shadow-sm">
                <ProgressSteps
                  isActive={stage === 'pending'}
                  hasError={stage === 'error'}
                />
              </div>
            )}
          </>
        )}

        {stage === 'success' && blobUrl && (
          <ResultCard blobUrl={blobUrl} onReset={handleReset} />
        )}
      </div>
    </main>
  )
}
